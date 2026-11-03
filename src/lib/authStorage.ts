// 토큰을 localStorage 에 보관하고, React 밖(api/client.ts)에서도 읽을 수 있게 하는 작은 저장소.
const TOKEN_KEY = 'basicproject.token'

// 시크릿 창 / 저장소 차단 환경에서는 localStorage 접근이 throw 할 수 있다 → 메모리에만 둔다.
function load(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

let current: string | null = load()

export function getToken(): string | null {
  return current
}

export function setToken(token: string | null): void {
  current = token
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // 저장하지 못해도 이번 탭에서는 current 로 동작한다.
  }
}

// HTTP 401 → api/setup.ts 의 핸들러가 발행 → AuthProvider 가 구독해 로그아웃 상태로 동기화.
export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export function emitUnauthorized(): void {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
}
