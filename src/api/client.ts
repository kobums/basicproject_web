// 앱 전체가 쓰는 단 하나의 HTTP 클라이언트 (fetch 래퍼).
//
// gomachine 생성 모델(src/gen/models/*.ts)이 기대하는 모양을 그대로 따른다:
//   get(url, cfg?) / post·put·patch(url, body?, cfg?) / del(url, cfg?) → Promise<{ data, status }>
//   cfg = { params?, data?, headers? }  (del 은 cfg.data 를 본문으로 보낸다, 빈 params 값은 뺀다)
// src/gen/services/api.ts 는 이 파일을 다시 내보내기만 한다 (gomachine 은 그 파일이 있으면 덮어쓰지 않는다).
//
// 토큰과 401 처리는 여기서 직접 하지 않고 앱 시작 때 등록한다 (src/api/setup.ts):
//   setTokenProvider(getToken)          → 모든 요청에 Authorization: Bearer <token>
//   setUnauthorizedHandler(handler)     → HTTP 401 이면 부른다 (토큰 삭제 + 로그아웃 이벤트)
//
// 에러:
//   HTTP 2xx 가 아니면 HttpError(status, message, fieldErrors, body) 를 던진다 (Spring 은 상태 코드로 에러를 알린다).
//   Go / Rust 백엔드는 HTTP 200 + {code: "error" | "auth error"} 로 에러를 알리는데,
//   이것은 생성 모델(models/contract.ts)이 ApiError 로 던진다. 화면에서는 errorMessage() (./errors) 로 둘 다 처리한다.

export interface ApiResponse<T> {
  data: T
  status: number
}

export interface RequestConfig {
  params?: object
  data?: unknown
  headers?: Record<string, string>
}

export class HttpError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>
  readonly body: unknown

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
    body?: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.body = body
  }
}

let baseUrl: string = import.meta.env.VITE_API_BASE_URL || '/api'
let tokenProvider: () => string | null = () => null
let unauthorizedHandler: (() => void) | null = null

/** 요청 주소 앞부분 (기본 VITE_API_BASE_URL, 없으면 '/api'). */
export function setBaseUrl(url: string): void {
  baseUrl = url
}

/** Authorization: Bearer 에 쓸 토큰을 돌려주는 함수 (없으면 null). */
export function setTokenProvider(fn: () => string | null): void {
  tokenProvider = fn
}

/** HTTP 401 응답을 받았을 때 부를 함수 (예: 토큰 삭제 + 로그아웃). */
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn
}

function query(params?: object): string {
  if (!params) return ''
  const q = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    q.append(key, String(value))
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

// Spring {status, message, fieldErrors}, Go {code, error}, 그 밖의 본문에서 메시지를 고른다.
function errorOf(status: number, data: unknown): HttpError {
  const body = (typeof data === 'object' && data !== null ? data : {}) as {
    message?: unknown
    error?: unknown
    code?: unknown
    fieldErrors?: unknown
  }
  const text = [body.message, body.error, body.code].find(
    (v): v is string => typeof v === 'string' && v !== '',
  )
  const fieldErrors =
    typeof body.fieldErrors === 'object' && body.fieldErrors !== null
      ? (body.fieldErrors as Record<string, string>)
      : {}
  const fallback = typeof data === 'string' && data ? data : undefined
  return new HttpError(
    status,
    text ?? fallback ?? `요청 실패 (HTTP ${status})`,
    fieldErrors,
    data,
  )
}

async function send<T>(
  method: string,
  url: string,
  body: unknown,
  cfg: RequestConfig = {},
): Promise<ApiResponse<T>> {
  // FormData(파일 업로드)는 브라우저가 boundary 포함 Content-Type 을 정하므로 건드리지 않는다.
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  const isJson = body !== undefined && !isForm
  const token = tokenProvider()
  let payload: BodyInit | undefined
  if (isForm) payload = body as FormData
  else if (isJson) payload = JSON.stringify(body)

  const res = await fetch(`${baseUrl}${url}${query(cfg.params)}`, {
    method,
    headers: {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...cfg.headers,
    },
    body: payload,
  })

  // 본문이 없으면(204 등) data 는 undefined, JSON 이 아니면 문자열 그대로.
  const text = await res.text()
  let data: unknown = undefined
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    // 토큰 만료/무효 → 등록한 핸들러가 토큰을 비우고 앱에 로그아웃을 알린다.
    if (res.status === 401) unauthorizedHandler?.()
    throw errorOf(res.status, data)
  }
  return { data: data as T, status: res.status }
}

export const get = <T>(url: string, cfg?: RequestConfig) =>
  send<T>('GET', url, undefined, cfg)
export const post = <T>(url: string, body?: unknown, cfg?: RequestConfig) =>
  send<T>('POST', url, body, cfg)
export const put = <T>(url: string, body?: unknown, cfg?: RequestConfig) =>
  send<T>('PUT', url, body, cfg)
export const patch = <T>(url: string, body?: unknown, cfg?: RequestConfig) =>
  send<T>('PATCH', url, body, cfg)
export const del = <T>(url: string, cfg?: RequestConfig) =>
  send<T>('DELETE', url, cfg?.data, cfg)
