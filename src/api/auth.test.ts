import { describe, expect, it } from 'vitest'
import { mockFetch } from '../test/mockFetch'
import { fetchMe, login, signup, toAuthResult, toMe } from './auth'
import { HttpError } from './client'
import { fieldErrorsOf } from './errors'
import { ApiError } from '../gen/models/contract'

const user = {
  id: 1,
  email: 'a@b.c',
  name: 'kim',
  level: 1,
  createddate: '2026-01-01 10:00:00',
}
const authBody = {
  token: 't',
  tokenType: 'Bearer',
  expiresInMs: 86400000,
  user,
}

describe('auth 응답 정리 (계약)', () => {
  it('{token, tokenType, expiresInMs, user}', () => {
    expect(toAuthResult(authBody)).toEqual({
      token: 't',
      expiresInMs: 86400000,
      user,
    })
  })

  it('토큰이나 사용자가 없으면 던진다', () => {
    expect(() => toAuthResult({ user })).toThrow(ApiError)
    expect(() => toAuthResult({ token: 't' })).toThrow(ApiError)
    expect(() => toAuthResult({ token: 't', user: { email: 'x' } })).toThrow(
      ApiError,
    )
  })

  it('me: user 객체 그대로', () => {
    expect(toMe(user)).toEqual(user)
    expect(() => toMe({})).toThrow(ApiError)
  })
})

describe('auth API', () => {
  it('login: POST /auth/login 한 번으로 토큰과 사용자를 받는다', async () => {
    const calls = mockFetch({ body: authBody })
    const res = await login({ email: 'a@b.c', password: 'pw' })
    expect(res).toEqual({ token: 't', expiresInMs: 86400000, user })
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({
      url: '/api/auth/login',
      method: 'POST',
      body: { email: 'a@b.c', password: 'pw' },
    })
  })

  it('signup: 201 {token, ..., user}', async () => {
    const calls = mockFetch({ status: 201, body: { ...authBody, token: 's' } })
    const res = await signup({ email: 'a@b.c', name: 'kim', password: 'pw' })
    expect(res.token).toBe('s')
    expect(res.user).toEqual(user)
    expect(calls[0]).toMatchObject({ url: '/api/auth/signup', method: 'POST' })
  })

  it('signup 검증 실패: 400 {status, message, fieldErrors}', async () => {
    mockFetch({
      status: 400,
      body: {
        status: 400,
        message: '입력값을 확인하세요.',
        fieldErrors: { email: '이메일 형식이 아닙니다.' },
      },
    })
    const e = await signup({ email: 'x', name: 'k', password: 'pw' }).catch(
      (x: unknown) => x,
    )
    expect(e).toBeInstanceOf(HttpError)
    expect((e as HttpError).message).toBe('입력값을 확인하세요.')
    expect(fieldErrorsOf(e)).toEqual({ email: '이메일 형식이 아닙니다.' })
  })

  it('login 실패: 401 {status, message}', async () => {
    mockFetch({ status: 401, body: { status: 401, message: 'bad login' } })
    const e = await login({ email: 'a@b.c', password: 'x' }).catch(
      (x: unknown) => x,
    )
    expect(e).toBeInstanceOf(HttpError)
    expect((e as HttpError).status).toBe(401)
  })

  it('fetchMe: GET /auth/me → user', async () => {
    const calls = mockFetch({ body: user })
    expect(await fetchMe()).toEqual(user)
    expect(calls[0].url).toBe('/api/auth/me')
  })
})
