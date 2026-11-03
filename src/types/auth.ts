import type { User } from '../gen/types/user'

// POST /api/auth/login 본문
export interface LoginRequest {
  email: string
  password: string
}

// POST /api/auth/signup 본문
export interface SignupRequest {
  email: string
  name: string
  password: string
}

// login / signup 응답 {token, tokenType: "Bearer", expiresInMs, user} 을 정리한 결과
export interface AuthResult {
  token: string
  // 토큰 유효 시간 (밀리초). 백엔드 JWT_EXPIRATION_MS, 기본 24시간
  expiresInMs?: number
  user: User
}
