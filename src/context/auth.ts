import { createContext, useContext } from 'react'
import type { User } from '../types/user'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  // 앱 시작 시 저장된 토큰으로 /auth/me 복구가 진행 중인지.
  // RequireAuth 가 이 동안 리다이렉트를 보류해 새로고침 시 로그인으로 튕기지 않게 한다.
  restoring: boolean
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
