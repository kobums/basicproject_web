import { describe, expect, it } from 'vitest'
import { mockFetch } from '../test/mockFetch'
import { fetchMe, login, signup, toMe, toTokenResponse } from './auth'
import { ApiError } from '../gen/models/contract'

const user = {
  id: 1,
  email: 'a@b.c',
  name: 'kim',
  level: 1,
  createddate: '2026-01-01 10:00:00',
}

describe('auth 응답 정리', () => {
  it('{token, user} (기본 계약)', () => {
    expect(toTokenResponse({ token: 't', user })).toEqual({ token: 't', user })
  })

  it('{accessToken} / access_token / Go 봉투 / item 봉투', () => {
    expect(toTokenResponse({ accessToken: 'a' })).toEqual({
      token: 'a',
      user: null,
    })
    expect(toTokenResponse({ access_token: 'b' }).token).toBe('b')
    expect(toTokenResponse({ code: 'ok', token: 'c', user }).user).toEqual(user)
    expect(toTokenResponse({ code: 'ok', item: { token: 'd', user } })).toEqual(
      { token: 'd', user },
    )
  })

  it('Go 에러 code 와 토큰 없는 응답은 던진다', () => {
    expect(() => toTokenResponse({ code: 'error' })).toThrow(ApiError)
    expect(() => toTokenResponse({ user })).toThrow(ApiError)
  })

  it('예전 Spring 모양(createdAt, tokenType)도 받는다', () => {
    const res = toTokenResponse({
      token: 't',
      tokenType: 'Bearer',
      expiresInMs: 1000,
      user: { id: '7', email: 'x@y.z', name: 'lee', createdAt: '2026-02-02' },
    })
    expect(res.user).toEqual({
      id: 7,
      email: 'x@y.z',
      name: 'lee',
      level: 0,
      createddate: '2026-02-02',
    })
  })

  it('me: 객체 그대로 / {user} / {code, item}', () => {
    expect(toMe(user)).toEqual(user)
    expect(toMe({ user })).toEqual(user)
    expect(toMe({ code: 'ok', item: user })).toEqual(user)
    expect(() => toMe({ code: 'auth error' })).toThrow(ApiError)
    expect(() => toMe({ code: 'ok', item: null })).toThrow(ApiError)
  })
})

describe('auth API', () => {
  it('login: user 가 없으면 받은 토큰으로 /auth/me 를 부른다', async () => {
    const calls = mockFetch({ body: { token: 'new' } }, { body: user })
    const res = await login({ email: 'a@b.c', password: 'pw' })
    expect(res).toEqual({ token: 'new', user })
    expect(calls[0]).toMatchObject({
      url: '/api/auth/login',
      method: 'POST',
      body: { email: 'a@b.c', password: 'pw' },
    })
    expect(calls[1].url).toBe('/api/auth/me')
    expect(calls[1].headers.Authorization).toBe('Bearer new')
  })

  it('signup: {token, user} 면 한 번만 부른다', async () => {
    const calls = mockFetch({ status: 201, body: { token: 's', user } })
    const res = await signup({ email: 'a@b.c', name: 'kim', password: 'pw' })
    expect(res.token).toBe('s')
    expect(calls).toHaveLength(1)
  })

  it('fetchMe: Go 식 {code, user}', async () => {
    mockFetch({ body: { code: 'ok', user } })
    expect(await fetchMe()).toEqual(user)
  })
})
