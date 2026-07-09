import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LoadingContext } from '../context/loading'
import { Spinner } from './Spinner'

interface LoadingProviderProps {
  children: ReactNode
}

// 앱 전역 로딩 오버레이 Provider. 페이지에서는 useLoading() 의 show/hide 호출.
// 카운트 방식이라 여러 요청이 겹쳐도 마지막 hide 에서만 사라진다.
export function LoadingProvider({ children }: Readonly<LoadingProviderProps>) {
  const [count, setCount] = useState(0)

  const show = useCallback(() => setCount((c) => c + 1), [])
  const hide = useCallback(() => setCount((c) => Math.max(0, c - 1)), [])
  const value = useMemo(() => ({ show, hide }), [show, hide])

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {count > 0 &&
        createPortal(
          <div className="loading-overlay" aria-busy="true">
            <Spinner size="lg" />
          </div>,
          document.body,
        )}
    </LoadingContext.Provider>
  )
}
