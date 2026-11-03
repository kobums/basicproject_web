import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockFetch } from '../test/mockFetch'
import { del, get, HttpError, post } from './client'
import { setupApi } from './setup'
import { getToken, setToken, UNAUTHORIZED_EVENT } from '../lib/authStorage'

setupApi()

afterEach(() => {
  setToken(null)
})

describe('api client', () => {
  it('저장된 토큰을 Bearer 헤더로 보낸다', async () => {
    const calls = mockFetch({ body: { ok: true } }, { body: {} })
    setToken('t-1')
    await get('/board', { params: { page: 1, title: '', user: undefined } })
    expect(calls[0].url).toBe('/api/board?page=1')
    expect(calls[0].headers.Authorization).toBe('Bearer t-1')

    setToken(null)
    await get('/board')
    expect(calls[1].headers.Authorization).toBeUndefined()
    expect(localStorage.getItem('basicproject.token')).toBeNull()
  })

  it('JSON 본문과 { data, status } 를 돌려준다', async () => {
    const calls = mockFetch({ status: 201, body: { id: 3, code: 'ok' } })
    const res = await post('/board', { title: 'a' })
    expect(res).toEqual({ data: { id: 3, code: 'ok' }, status: 201 })
    expect(calls[0].method).toBe('POST')
    expect(calls[0].headers['Content-Type']).toBe('application/json')
    expect(calls[0].body).toEqual({ title: 'a' })
  })

  it('del 은 cfg.data 를 본문으로 보내고 빈 응답(204)은 undefined', async () => {
    const calls = mockFetch({ status: 204 })
    const res = await del('/board/batch', { data: [{ id: 1 }] })
    expect(res.data).toBeUndefined()
    expect(calls[0].method).toBe('DELETE')
    expect(calls[0].body).toEqual([{ id: 1 }])
  })

  it('401 이면 토큰을 비우고 로그아웃 이벤트를 쏜다', async () => {
    mockFetch({ status: 401, body: { status: 401, message: '만료' } })
    setToken('old')
    const listener = vi.fn()
    window.addEventListener(UNAUTHORIZED_EVENT, listener)
    const err = await get('/auth/me').catch((e: unknown) => e)
    window.removeEventListener(UNAUTHORIZED_EVENT, listener)

    expect(err).toBeInstanceOf(HttpError)
    expect((err as HttpError).status).toBe(401)
    expect((err as HttpError).message).toBe('만료')
    expect(getToken()).toBeNull()
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('401 이 아닌 에러는 토큰을 지우지 않고 fieldErrors 를 담는다', async () => {
    mockFetch({
      status: 400,
      body: { message: '입력 오류', fieldErrors: { email: '필수' } },
    })
    setToken('keep')
    const err = (await post('/user', {}).catch((e: unknown) => e)) as HttpError
    expect(err.status).toBe(400)
    expect(err.fieldErrors).toEqual({ email: '필수' })
    expect(getToken()).toBe('keep')
  })

  it('Go 식 400 {code} 와 JSON 이 아닌 본문도 메시지로 쓴다', async () => {
    mockFetch(
      { status: 400, body: { code: 'bad request' } },
      { status: 502, body: 'Bad Gateway' },
    )
    const a = (await get('/board').catch((e: unknown) => e)) as HttpError
    expect(a.message).toBe('bad request')
    const b = (await get('/board').catch((e: unknown) => e)) as HttpError
    expect(b.message).toBe('Bad Gateway')
    expect(b.body).toBe('Bad Gateway')
  })
})
