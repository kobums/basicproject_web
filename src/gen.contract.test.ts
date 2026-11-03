// gomachine 생성 모델(src/gen)이 Go / Spring 어느 응답 모양이든 같은 결과를 내는지 확인한다.
import { describe, expect, it } from 'vitest'
import { mockFetch } from './test/mockFetch'
import BoardModel from './gen/models/board'
import UserModel from './gen/models/user'
import { ApiError } from './gen/models/contract'
import { HttpError } from './api/client'
import type { Board } from './gen/types/board'

const author = {
  id: 7,
  email: 'a@b.c',
  name: 'kim',
  level: 1,
  createddate: '2026-01-01 00:00:00',
}
const board = (id: number): Board => ({
  id,
  title: `t${id}`,
  content: null,
  img: null,
  user: 7,
  createddate: '2026-01-02 03:04:05',
  extra: { user: author },
})
const springPage = (items: Board[], total: number) => ({
  content: items,
  page: 1,
  size: 10,
  pagesize: 10,
  totalElements: total,
  totalPages: Math.ceil(total / 10),
  first: true,
  last: false,
  empty: items.length === 0,
})

describe('findpage (목록)', () => {
  it('Go {items, total, code}', async () => {
    const calls = mockFetch({
      body: { items: [board(1)], total: 21, code: 'ok' },
    })
    const page = await BoardModel.findpage({
      page: 2,
      pagesize: 10,
      orderby: 'id desc',
      title: 'x',
    })
    expect(page).toEqual({ items: [board(1)], total: 21 })
    expect(page.items[0].extra?.user?.name).toBe('kim')
    expect(calls[0].url).toBe(
      '/api/board?page=2&pagesize=10&orderby=id+desc&title=x',
    )
  })

  it('Spring 페이지', async () => {
    mockFetch({ body: springPage([board(1), board(2)], 12) })
    const page = await BoardModel.findpage({ page: 1, pagesize: 10 })
    expect(page.items).toHaveLength(2)
    expect(page.total).toBe(12)
  })

  it('Go items: null 은 빈 목록', async () => {
    mockFetch({ body: { items: null, total: 0, code: 'ok' } })
    expect(await BoardModel.findpage({ page: 1, pagesize: 10 })).toEqual({
      items: [],
      total: 0,
    })
  })
})

describe('get (단건)', () => {
  it('Go {item} / {item: null} / Spring 엔티티 / Spring 404', async () => {
    mockFetch(
      { body: { item: board(3), code: 'ok' } },
      { body: { item: null, code: 'ok' } },
      { body: board(4) },
      { status: 404, body: { status: 404, message: 'not found' } },
    )
    expect(await BoardModel.get(3)).toEqual(board(3))
    expect(await BoardModel.get(9)).toBeNull()
    expect(await BoardModel.get(4)).toEqual(board(4))
    await expect(BoardModel.get(5)).rejects.toBeInstanceOf(HttpError)
  })
})

describe('쓰기', () => {
  it('insert: Go {id, code} / Spring 엔티티 → id', async () => {
    const calls = mockFetch(
      { body: { id: 10, code: 'ok' } },
      { status: 201, body: board(11) },
    )
    expect((await BoardModel.insert({ title: 'a' })).id).toBe(10)
    expect((await BoardModel.insert({ title: 'b' })).id).toBe(11)
    expect(calls[0]).toMatchObject({
      url: '/api/board',
      method: 'POST',
      body: { title: 'a' },
    })
  })

  it('update / remove 경로', async () => {
    const calls = mockFetch(
      { body: { code: 'ok' } },
      { body: { success: true } },
    )
    await UserModel.update(7, { name: 'lee' })
    await UserModel.remove(7)
    expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
      'PUT /api/user/7',
      'DELETE /api/user/7',
    ])
  })

  it('Go HTTP 200 + code 에러는 ApiError', async () => {
    mockFetch({ body: { code: 'auth error' } }, { body: { code: 'error' } })
    const e = await BoardModel.remove(1).catch((x: unknown) => x)
    expect(e).toBeInstanceOf(ApiError)
    expect((e as ApiError).code).toBe('auth error')
    await expect(BoardModel.findpage({ page: 1 })).rejects.toBeInstanceOf(
      ApiError,
    )
  })
})

describe('count', () => {
  it('Go {total, count} / Spring {count}', async () => {
    mockFetch(
      { body: { total: 5, count: 5, code: 'ok' } },
      { body: { count: 6 } },
    )
    expect(await UserModel.count()).toBe(5)
    expect(await UserModel.count()).toBe(6)
  })
})
