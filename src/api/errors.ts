// 화면에 보여줄 에러 문구. 두 종류의 에러를 같이 다룬다:
//   HttpError  : HTTP 2xx 가 아닌 응답 (Spring 의 400/401/403/404/409, Go 의 400 bad request 등)
//   ApiError   : HTTP 200 + {code: "error" | "auth error" | "bad request"} (Go / Rust 백엔드, 생성 모델이 던진다)
import { HttpError } from './client'
import { ApiError } from '../gen/models/contract'

const CODE_MESSAGES: Record<string, string> = {
  'auth error': '권한이 없습니다. 로그인 상태를 확인하세요.',
  'bad request': '잘못된 요청입니다.',
  error: '요청을 처리하지 못했습니다.',
}

export function errorMessage(e: unknown, fallback = '요청에 실패했습니다.') {
  if (e instanceof ApiError) {
    return typeof e.detail === 'string' && e.detail
      ? e.detail
      : (CODE_MESSAGES[e.code] ?? fallback)
  }
  if (e instanceof HttpError) {
    if (e.status === 401) return '로그인이 필요합니다.'
    if (e.status === 403) return '권한이 없습니다.'
    if (e.status === 404) return '찾을 수 없습니다.'
    return CODE_MESSAGES[e.message] ?? e.message
  }
  if (e instanceof Error && e.message) return e.message
  return fallback
}

// 입력값 오류(필드별 메시지). Spring 은 400 + fieldErrors 를 준다.
export function fieldErrorsOf(e: unknown): Record<string, string> {
  return e instanceof HttpError && e.status === 400 ? e.fieldErrors : {}
}
