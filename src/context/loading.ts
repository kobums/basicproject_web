import { createContext, useContext } from 'react'

export interface LoadingControl {
  show: () => void
  hide: () => void
}

export const LoadingContext = createContext<LoadingControl | null>(null)

// 전역 로딩 오버레이를 켜고 끄는 훅. show/hide 는 중첩 호출을 지원한다
// (show 2번 → hide 2번 해야 사라짐).
export function useLoading(): LoadingControl {
  const ctx = useContext(LoadingContext)
  if (!ctx) {
    throw new Error('useLoading 은 LoadingProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
