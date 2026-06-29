// 아주 얇은 fetch 래퍼. axios 대신 직접 작성해서 동작 원리를 익힌다.
import { getToken, setToken, emitUnauthorized } from '../lib/authStorage'

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

// 백엔드 ApiExceptionHandler 의 에러 응답 형태
interface ApiError {
  status: number
  message: string
  fieldErrors?: Record<string, string>
}

export class HttpError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // FormData(파일 업로드)는 브라우저가 boundary 포함 Content-Type 을 직접 설정하므로 건드리지 않는다.
  const isFormData = init?.body instanceof FormData
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      // 로그인 상태면 모든 요청에 JWT 를 실어 보낸다.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!res.ok) {
    // 토큰 만료/무효 → 저장된 토큰을 비우고 앱에 로그아웃을 알린다.
    if (res.status === 401) {
      setToken(null)
      emitUnauthorized()
    }
    let message = `요청 실패 (HTTP ${res.status})`
    let fieldErrors: Record<string, string> = {}
    try {
      const body = (await res.json()) as ApiError
      message = body.message ?? message
      fieldErrors = body.fieldErrors ?? {}
    } catch {
      // 본문이 없거나 JSON 이 아니면 기본 메시지 사용
    }
    throw new HttpError(res.status, message, fieldErrors)
  }

  // 204 No Content (삭제 등) 는 본문이 없다
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

// JSON 또는 FormData 를 모두 보낼 수 있도록 body 를 그대로 전달하거나 직렬화한다.
function toBody(body: unknown): BodyInit {
  return body instanceof FormData ? body : JSON.stringify(body)
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: toBody(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: toBody(body) }),
  del: (path: string) => request<void>(path, { method: 'DELETE' }),
}
