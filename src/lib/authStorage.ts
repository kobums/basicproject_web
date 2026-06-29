// 토큰을 localStorage 에 보관하고, React 밖(api/client.ts)에서도 읽을 수 있게 하는 작은 저장소.
const TOKEN_KEY = 'basicproject.token'

let current: string | null = localStorage.getItem(TOKEN_KEY)

export function getToken(): string | null {
  return current
}

export function setToken(token: string | null): void {
  current = token
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

// 401 응답 시 client.ts 가 발행 → AuthProvider 가 구독해 로그아웃 상태로 동기화.
export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export function emitUnauthorized(): void {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
}
