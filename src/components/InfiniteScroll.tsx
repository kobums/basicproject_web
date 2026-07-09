import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Spinner } from './Spinner'

interface InfiniteScrollProps {
  children: ReactNode // 목록
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void // 감시 지점이 화면에 들어오면 호출
}

// 목록 끝의 감시 지점(sentinel)이 보이면 onLoadMore 를 호출하는 무한 스크롤 래퍼.
// IntersectionObserver 사용 — 스크롤 이벤트 폴링보다 효율적이다.
export function InfiniteScroll({
  children,
  hasMore,
  loading,
  onLoadMore,
}: Readonly<InfiniteScrollProps>) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  // 최신 콜백/상태를 observer 안에서 읽기 위한 ref
  const stateRef = useRef({ hasMore, loading, onLoadMore })
  useEffect(() => {
    stateRef.current = { hasMore, loading, onLoadMore }
  })

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      const { hasMore: more, loading: busy, onLoadMore: load } = stateRef.current
      if (entries[0].isIntersecting && more && !busy) load()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="infinite-sentinel">
          {loading && <Spinner size="sm" />}
        </div>
      )}
    </div>
  )
}
