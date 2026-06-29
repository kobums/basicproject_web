export type { PageResponse } from './page'

// 백엔드 UserResponse 와 대응 (user_tb, 비밀번호 제외)
export interface User {
  id: number
  email: string
  name: string | null
  createdAt: string
}

export interface UserCreateRequest {
  email: string
  name: string
  password: string
}

export interface UserUpdateRequest {
  name: string
  password: string // 비우면 기존 비밀번호 유지
}
