// fetch 를 바꿔 끼우는 작은 도우미. 응답을 차례로 돌려주고 요청을 기록한다.
import { vi } from 'vitest'

export interface Call {
  url: string
  method: string
  headers: Record<string, string>
  body: unknown
}

export interface MockReply {
  status?: number
  body?: unknown // 객체는 JSON 으로, 문자열은 그대로 보낸다
}

export function mockFetch(...replies: MockReply[]) {
  const calls: Call[] = []
  const queue = [...replies]
  const fn = vi.fn(async (url: string, init: RequestInit = {}) => {
    const body =
      typeof init.body === 'string' ? JSON.parse(init.body) : init.body
    calls.push({
      url,
      method: init.method ?? 'GET',
      headers: (init.headers ?? {}) as Record<string, string>,
      body,
    })
    const reply = queue.shift() ?? { status: 200, body: {} }
    const text =
      reply.body === undefined
        ? ''
        : typeof reply.body === 'string'
          ? reply.body
          : JSON.stringify(reply.body)
    return new Response(text === '' ? null : text, {
      status: reply.status ?? 200,
    })
  })
  vi.stubGlobal('fetch', fn)
  return calls
}
