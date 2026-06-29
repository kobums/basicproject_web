import { useEffect, useState } from 'react'
import { fetchUser } from '../api/users'
import type { User } from '../types/user'

export function useUser(id: number) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchUser(id)
      .then((u) => {
        if (!cancelled) setUser(u)
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : '회원 정보를 불러오지 못했습니다.',
          )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { user, loading, error }
}
