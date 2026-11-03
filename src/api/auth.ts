// 인증 API (손으로 만든 부분). 생성 모델이 없는 /api/auth/* 를 부른다.
//
// 백엔드(Go / Spring / Rust)마다 응답 모양이 조금 달라도 받아들인다:
//   login / signup : { token, user? }                    ← 기본 계약
//                    { accessToken, user? }              (token 대신 accessToken / access_token)
//                    { code: "ok", token, user? }        (Go 식 봉투. code 가 "error" 등이면 ApiError)
//                    { item: { token, user? } } / { data: {...} } (한 겹 감싼 응답)
//                    user 가 없으면 받은 토큰으로 GET /api/auth/me 를 한 번 더 부른다.
//   me             : 사용자 객체 그대로, 또는 { user } / { item } / { code, user | item }
//   사용자 객체     : GET /api/user/:id 와 같은 JSON (id, email, name, level, createddate. 비밀번호 없음).
//                    예전 이름 createdAt 도 createddate 로 받는다.
import { get, post } from './client'
import { ApiError, checkGoError } from '../gen/models/contract'
import type { User } from '../gen/types/user'
import type { AuthResult, LoginRequest, SignupRequest } from '../types/auth'

type Json = Record<string, unknown>

function isRecord(v: unknown): v is Json {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function numberOf(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)))
    return Number(v)
  return undefined
}

function stringOf(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v)
}

// 응답 봉투를 벗긴다: Go 의 code 에러는 ApiError 로 던지고, {item} / {data} 한 겹은 연다.
function unwrap(data: unknown): Json {
  checkGoError(data)
  if (!isRecord(data)) return {}
  for (const key of ['item', 'data']) {
    const inner = data[key]
    if (isRecord(inner)) return { ...inner, ...pick(data, ['token', 'user']) }
  }
  return data
}

function pick(data: Json, keys: string[]): Json {
  const ret: Json = {}
  for (const k of keys) if (data[k] !== undefined) ret[k] = data[k]
  return ret
}

/** 사용자 JSON → User. id 가 없으면 null. */
export function toUser(raw: unknown): User | null {
  if (!isRecord(raw)) return null
  const id = numberOf(raw.id)
  if (id === undefined) return null
  return {
    id,
    email: stringOf(raw.email),
    name: stringOf(raw.name),
    level: numberOf(raw.level) ?? 0,
    createddate: stringOf(raw.createddate ?? raw.createdAt),
  }
}

/** /auth/me 응답에서 사용자를 꺼낸다. */
export function toMe(data: unknown): User {
  const body = unwrap(data)
  const user = toUser(body.user) ?? toUser(body)
  if (!user) throw new ApiError('error', '사용자 정보를 읽지 못했습니다.')
  return user
}

/** login / signup 응답에서 토큰과 (있으면) 사용자를 꺼낸다. */
export function toTokenResponse(data: unknown): {
  token: string
  user: User | null
} {
  const body = unwrap(data)
  const token = [body.token, body.accessToken, body.access_token].find(
    (v): v is string => typeof v === 'string' && v !== '',
  )
  if (!token) throw new ApiError('error', '응답에 토큰이 없습니다.')
  return { token, user: toUser(body.user) }
}

async function withUser(data: unknown): Promise<AuthResult> {
  const { token, user } = toTokenResponse(data)
  if (user) return { token, user }
  // 토큰만 준 백엔드: 아직 저장하지 않은 새 토큰으로 사용자 정보를 읽는다.
  const me = await get<unknown>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return { token, user: toMe(me.data) }
}

export async function login(body: LoginRequest): Promise<AuthResult> {
  const res = await post<unknown>('/auth/login', body)
  return withUser(res.data)
}

export async function signup(body: SignupRequest): Promise<AuthResult> {
  const res = await post<unknown>('/auth/signup', body)
  return withUser(res.data)
}

// 저장된 토큰으로 현재 사용자 정보 조회 (앱 시작 시 토큰 유효성 확인용)
export async function fetchMe(): Promise<User> {
  const res = await get<unknown>('/auth/me')
  return toMe(res.data)
}
