import { api } from './client'
import type { LoginRequest, SignupRequest, TokenResponse } from '../types/auth'
import type { User } from '../types/user'

export const login = (body: LoginRequest) =>
  api.post<TokenResponse>('/auth/login', body)

export const signup = (body: SignupRequest) =>
  api.post<TokenResponse>('/auth/signup', body)

// 저장된 토큰으로 현재 사용자 정보 조회 (앱 시작 시 토큰 유효성 확인용)
export const fetchMe = () => api.get<User>('/auth/me')
