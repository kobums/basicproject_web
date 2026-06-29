import { useCallback, useEffect, useState } from 'react'
import { fetchBoards } from '../api/boards'
import type { Board, BoardSearch, PageResponse } from '../types/board'

// 목록 + 페이징 + 검색 상태를 캡슐화한 커스텀 훅.
// useState / useEffect / useCallback 의 협업을 연습하는 예제.
const EMPTY_SEARCH: BoardSearch = { type: 'title', keyword: '' }

export function useBoards(initialPage = 0) {
  const [page, setPage] = useState(initialPage)
  // 실제로 조회에 반영된(=커밋된) 검색 조건. 입력 중인 값은 SearchBar 가 따로 관리.
  const [search, setSearch] = useState<BoardSearch>(EMPTY_SEARCH)
  const [data, setData] = useState<PageResponse<Board> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // page 또는 search 가 바뀔 때마다 재생성되는 로더. reload() 로 수동 재조회도 가능.
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchBoards(page, search))
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    void load()
  }, [load])

  // 검색 실행: 조건을 커밋하고 항상 첫 페이지부터 다시 조회.
  const submitSearch = useCallback((next: BoardSearch) => {
    setSearch(next)
    setPage(0)
  }, [])

  return { data, loading, error, page, setPage, search, submitSearch, reload: load }
}
