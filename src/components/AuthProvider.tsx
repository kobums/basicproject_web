import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from '../context/auth'
import type { User } from '../gen/types/user'
import { fetchMe } from '../api/auth'
import { getToken, setToken, UNAUTHORIZED_EVENT } from '../lib/authStorage'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null)
  // 저장된 토큰이 있으면 복구가 끝날 때까지 restoring 상태 유지
  const [restoring, setRestoring] = useState(() => Boolean(getToken()))

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
        // HTTP 401 이면 api/setup.ts 의 핸들러가 이미 토큰을 비우고 이벤트를 쏜다.
        // 그 밖의 실패(네트워크 등)는 토큰을 두고 비로그인으로만 본다 (새로고침하면 다시 시도).
        setUser(null)
      })
      .finally(() => setRestoring(false))
  }, [])

  // 401 발생 시(다른 요청 중 토큰 만료) 로그아웃 상태로 동기화한다.
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      restoring,
      setSession,
      logout,
    }),
    [user, restoring, setSession, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
