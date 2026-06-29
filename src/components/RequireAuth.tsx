import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth'

interface RequireAuthProps {
  children: ReactNode
}

// 인증이 필요한 페이지를 감싼다. 비로그인 시 로그인 페이지로 보내고,
// 로그인 후 원래 가려던 경로로 돌아올 수 있도록 state.from 에 현재 경로를 담는다.
export function RequireAuth({ children }: Readonly<RequireAuthProps>) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    )
  }
  return <>{children}</>
}
