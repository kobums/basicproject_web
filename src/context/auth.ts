import { createContext, useContext } from 'react'
import type { User } from '../types/user'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  // 토큰 + 사용자 정보를 받아 로그인 상태로 전환
  setSession: (token: string, user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
