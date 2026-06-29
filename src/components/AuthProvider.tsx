import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from '../context/auth'
import type { User } from '../types/user'
import { fetchMe } from '../api/auth'
import {
  getToken,
  setToken,
  UNAUTHORIZED_EVENT,
} from '../lib/authStorage'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null)

  const setSession = useCallback((token: string, nextUser: User) => {
    setToken(token)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // 앱 시작 시 저장된 토큰이 있으면 /auth/me 로 사용자 정보를 복구한다.
  useEffect(() => {
    if (!getToken()) return
    fetchMe()
      .then(setUser)
      .catch(() => {
        // 토큰이 만료/무효면 client.ts 가 이미 토큰을 비우고 이벤트를 쏜다.
        setUser(null)
      })
  }, [])

  // 401 발생 시(다른 요청 중 토큰 만료) 로그아웃 상태로 동기화한다.
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
