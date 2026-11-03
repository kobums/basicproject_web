// 인증 API (손으로 만든 부분). 생성 모델이 없는 /api/auth/* 를 부른다.
//
// 계약 (Go / Spring / Rust 템플릿 공통, gomachine README "인증 API 계약"):
//   POST /auth/signup {email, password, name} → 201 {token, tokenType: "Bearer", expiresInMs, user}
//   POST /auth/login  {email, password}       → 200 {token, tokenType: "Bearer", expiresInMs, user}
//   GET  /auth/me (Bearer)                    → 200 user
//   user = {id, email, name, level, createddate} (비밀번호 없음, createddate 는 "yyyy-MM-dd HH:mm:ss")
//   에러 = HTTP 상태 + {status, message, fieldErrors?} → client 가 HttpError 로 던진다.
import { get, post } from './client'
import { ApiError } from '../gen/models/contract'
import type { User } from '../gen/types/user'
import type { AuthResult, LoginRequest, SignupRequest } from '../types/auth'

type Json = Record<string, unknown>

function isRecord(v: unknown): v is Json {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** 사용자 JSON → User. id 가 숫자가 아니면 null. */
export function toUser(raw: unknown): User | null {
  if (!isRecord(raw) || typeof raw.id !== 'number') return null
  return {
    id: raw.id,
    email: String(raw.email ?? ''),
    name: String(raw.name ?? ''),
    level: typeof raw.level === 'number' ? raw.level : 0,
    createddate: String(raw.createddate ?? ''),
  }
}

/** /auth/me 응답 → User. */
export function toMe(data: unknown): User {
  const user = toUser(data)
  if (!user) throw new ApiError('error', '사용자 정보를 읽지 못했습니다.')
  return user
}

/** login / signup 응답 → {token, expiresInMs, user}. */
export function toAuthResult(data: unknown): AuthResult {
  const body = isRecord(data) ? data : {}
  const token = typeof body.token === 'string' ? body.token : ''
  if (!token) throw new ApiError('error', '응답에 토큰이 없습니다.')
  const user = toUser(body.user)
  if (!user) throw new ApiError('error', '응답에 사용자 정보가 없습니다.')
  const expiresInMs =
    typeof body.expiresInMs === 'number' ? body.expiresInMs : undefined
  return { token, expiresInMs, user }
}

export async function login(body: LoginRequest): Promise<AuthResult> {
  const res = await post<unknown>('/auth/login', body)
  return toAuthResult(res.data)
}

export async function signup(body: SignupRequest): Promise<AuthResult> {
  const res = await post<unknown>('/auth/signup', body)
  return toAuthResult(res.data)
}

// 저장된 토큰으로 현재 사용자 정보 조회 (앱 시작 시 토큰 유효성 확인용)
export async function fetchMe(): Promise<User> {
  const res = await get<unknown>('/auth/me')
  return toMe(res.data)
}
