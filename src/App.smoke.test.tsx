// @vitest-environment happy-dom
// 화면 스모크 테스트: 백엔드 없이 fetch 를 흉내 내어 로그인 복구 → 게시판 목록 / 상세가 그려지는지 본다.
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { AuthProvider } from './components/AuthProvider'
import { FeedbackProvider } from './components/FeedbackProvider'
import { LoadingProvider } from './components/LoadingProvider'
import { setupApi } from './api/setup'
import { setToken } from './lib/authStorage'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
setupApi()

const me = {
  id: 7,
  email: 'kim@example.com',
  name: 'kim',
  level: 1,
  createddate: '2026-01-01 00:00:00',
}
const board = {
  id: 3,
  title: '첫 글',
  content: '본문입니다',
  img: null,
  user: 7,
  createddate: '2026-01-02 03:04:05',
  extra: { user: me },
}

// 경로별 응답 (Go 모양)
function backend(url: string): unknown {
  const path = url.split('?')[0]
  if (path === '/api/auth/me') return me
  if (path === '/api/board') return { items: [board], total: 1, code: 'ok' }
  if (path === '/api/board/3') return { item: board, code: 'ok' }
  return { code: 'error' }
}

let root: Root | null = null
let container: HTMLElement | null = null

async function render(path: string) {
  const calls: string[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      calls.push(url)
      return new Response(JSON.stringify(backend(url)), { status: 200 })
    }),
  )
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root!.render(
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <FeedbackProvider>
            <LoadingProvider>
              <App />
            </LoadingProvider>
          </FeedbackProvider>
        </AuthProvider>
      </MemoryRouter>,
    )
  })
  // 비동기 응답이 상태에 반영될 때까지 몇 번 더 돌린다.
  for (let i = 0; i < 5; i++) await act(async () => {})
  return { calls, text: () => container!.textContent ?? '' }
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  setToken(null)
  vi.unstubAllGlobals()
})

describe('App 스모크', () => {
  it('로그인 상태면 게시판 목록에 생성 모델 데이터와 조인 작성자가 보인다', async () => {
    setToken('t')
    const { calls, text } = await render('/')
    expect(text()).toContain('첫 글')
    expect(text()).toContain('kim') // extra.user.name
    expect(text()).toContain('전체 1건')
    expect(text()).toContain('2026-01-02 03:04')
    expect(calls).toContain('/api/auth/me')
    expect(calls).toContain('/api/board?page=1&pagesize=10&orderby=id+desc')
  })

  it('상세 화면', async () => {
    setToken('t')
    const { text } = await render('/boards/3')
    expect(text()).toContain('본문입니다')
    expect(text()).toContain('작성자 kim')
  })

  it('비로그인이면 로그인 화면으로 보낸다', async () => {
    const { calls, text } = await render('/')
    expect(text()).toContain('로그인')
    expect(calls).toHaveLength(0)
  })
})
