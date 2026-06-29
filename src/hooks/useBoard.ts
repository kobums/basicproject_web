import { useEffect, useState } from 'react'
import { fetchBoard } from '../api/boards'
import type { Board } from '../types/board'

// 단일 게시글 조회 훅. id 가 바뀌면 다시 불러온다.
// 컴포넌트 언마운트/ id 변경 시 stale 응답이 상태를 덮어쓰지 않도록 cancelled 플래그 사용.
export function useBoard(id: number) {
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchBoard(id)
      .then((b) => {
        if (!cancelled) setBoard(b)
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : '게시글을 불러오지 못했습니다.',
          )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { board, loading, error }
}
