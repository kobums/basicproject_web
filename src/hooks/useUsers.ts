import { useCallback, useEffect, useState } from 'react'
import { fetchUsers } from '../api/users'
import type { PageResponse, User } from '../types/user'

export function useUsers(initialPage = 0, initialSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)
  // keyword: 입력값(즉시 반영), debouncedKeyword: 실제 조회에 쓰이는 값
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [data, setData] = useState<PageResponse<User> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 입력이 멈춘 뒤 300ms 후에만 조회어를 갱신(타이핑마다 요청 폭주 방지).
  // 검색어가 바뀌면 첫 페이지부터 다시 본다 → page 0 도 함께 커밋해 중복 조회 방지.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
      setPage(0)
    }, 300)
    return () => clearTimeout(timer)
  }, [keyword])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchUsers(page, debouncedKeyword, size))
    } catch (e) {
      setError(
        e instanceof Error ? e.message : '회원 목록을 불러오지 못했습니다.',
      )
    } finally {
      setLoading(false)
    }
  }, [page, debouncedKeyword, size])

  useEffect(() => {
    void load()
  }, [load])

  // 페이지 크기 변경: 첫 페이지부터 다시 조회.
  const changeSize = useCallback((next: number) => {
    setSize(next)
    setPage(0)
  }, [])

  return {
    data,
    loading,
    error,
    page,
    setPage,
    size,
    changeSize,
    keyword,
    setKeyword,
    reload: load,
  }
}
