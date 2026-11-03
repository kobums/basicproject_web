// @vitest-environment happy-dom
// 화면 스모크 테스트: 백엔드 없이 fetch 를 흉내 내어 로그인 복구 → 게시판 / 회원 화면이 그려지는지,
// 작성자 / 관리자에게만 보이는 버튼이 맞게 나오는지 본다.
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

const kim = {
  id: 7,
  email: 'kim@example.com',
  name: 'kim',
  level: 1,
  createddate: '2026-01-01 00:00:00',
}
const lee = {
  id: 8,
  email: 'lee@example.com',
  name: 'lee',
  level: 1,
  createddate: '2026-01-01 00:00:00',
}
const admin = { ...lee, id: 1, name: 'admin', level: 3 }
// /auth/me 가 돌려줄 로그인 사용자
let me = kim
const board = {
  id: 3,
  title: '첫 글',
  content: '본문입니다',
  img: null,
  user: 7,
  createddate: '2026-01-02 03:04:05',
  extra: { user: kim },
}
// 다른 사람(lee)의 글: read "login" 이라 kim 도 목록 / 상세에서 본다.
const otherBoard = {
  ...board,
  id: 4,
  title: '남의 글',
  user: 8,
  extra: { user: lee },
}

// 경로별 응답 (Go 모양)
function backend(url: string): unknown {
  const path = url.split('?')[0]
  if (path === '/api/auth/me') return me
  if (path === '/api/board')
    return { items: [otherBoard, board], total: 2, code: 'ok' }
  if (path === '/api/board/3') return { item: board, code: 'ok' }
  if (path === '/api/board/4') return { item: otherBoard, code: 'ok' }
  // 회원 읽기: 관리자가 아니면 서버가 본인 행만 준다.
  if (path === '/api/user')
    return me.level >= 3
      ? { items: [kim, lee, me], total: 3, code: 'ok' }
      : { items: [me], total: 1, code: 'ok' }
  if (path === '/api/user/8') return { item: lee, code: 'ok' }
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

// 화면의 버튼 / 링크 글자 (nav 제외)
function buttons(): string[] {
  return [...container!.querySelectorAll('main a, main button')].map(
    (el) => el.textContent?.trim() ?? '',
  )
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  setToken(null)
  me = kim
  vi.unstubAllGlobals()
})

describe('App 스모크', () => {
  it('로그인 상태면 게시판 목록에 모든 사람의 글과 조인 작성자가 보인다', async () => {
    setToken('t')
    const { calls, text } = await render('/')
    expect(text()).toContain('첫 글')
    expect(text()).toContain('남의 글')
    expect(text()).toContain('kim') // extra.user.name
    expect(text()).toContain('lee')
    expect(text()).toContain('전체 2건')
    expect(text()).toContain('2026-01-02 03:04')
    expect(calls).toContain('/api/auth/me')
    expect(calls).toContain('/api/board?page=1&pagesize=10&orderby=id+desc')
  })

  it('상세 화면: 내 글이면 수정 / 삭제 버튼이 있다', async () => {
    setToken('t')
    const { text } = await render('/boards/3')
    expect(text()).toContain('본문입니다')
    expect(text()).toContain('작성자 kim')
    expect(buttons()).toEqual(expect.arrayContaining(['목록', '수정', '삭제']))
  })

  it('상세 화면: 남의 글이면 읽기만 (수정 / 삭제 없음)', async () => {
    setToken('t')
    const { text } = await render('/boards/4')
    expect(text()).toContain('작성자 lee')
    expect(buttons()).toContain('목록')
    expect(buttons()).not.toContain('수정')
    expect(buttons()).not.toContain('삭제')
  })

  it('남의 글 수정 화면은 막는다', async () => {
    setToken('t')
    const { text } = await render('/boards/4/edit')
    expect(text()).toContain('작성자만 수정할 수 있습니다.')
  })

  it('회원: 일반 사용자는 본인 정보만, 관리자 UI 없음', async () => {
    setToken('t')
    const { text } = await render('/users')
    expect(text()).toContain('본인 정보만 볼 수 있습니다')
    expect(text()).toContain('kim@example.com')
    expect(text()).not.toContain('lee@example.com')
    expect(buttons()).not.toContain('회원 추가')
    expect(container!.querySelector('input[type=search]')).toBeNull()
  })

  it('회원: 관리자(level >= 3)는 회원 추가 / 검색이 보인다', async () => {
    me = admin
    setToken('t')
    const { text } = await render('/users')
    expect(text()).toContain('전체 3명')
    expect(buttons()).toContain('회원 추가')
    expect(container!.querySelector('input[type=search]')).not.toBeNull()
  })

  it('회원 상세: 관리자는 다른 회원도 수정 / 삭제할 수 있다', async () => {
    me = admin
    setToken('t')
    await render('/users/8')
    expect(buttons()).toEqual(expect.arrayContaining(['수정', '삭제']))
  })

  it('회원 추가 화면은 관리자만', async () => {
    setToken('t')
    const { text } = await render('/users/new')
    expect(text()).toContain('관리자만 회원을 추가할 수 있습니다.')
  })

  it('비로그인이면 로그인 화면으로 보낸다', async () => {
    const { calls, text } = await render('/')
    expect(text()).toContain('로그인')
    expect(calls).toHaveLength(0)
  })
})
