import type { User } from './user'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  name: string
  password: string
}

// 백엔드 TokenResponse 와 대응
export interface TokenResponse {
  token: string
  tokenType: string
  expiresInMs: number
  user: User
}
