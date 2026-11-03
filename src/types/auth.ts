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

// login / signup 을 정리한 결과 (응답 모양은 api/auth.ts 참고)
export interface AuthResult {
  token: string
  user: User
}
