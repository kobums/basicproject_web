import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchBoards } from '../api/boards'
import type { Board, BoardSearch, PageResponse } from '../types/board'

// 목록 + 페이징 + 검색 상태를 캡슐화한 커스텀 훅.
// useState / useEffect / useCallback 의 협업을 연습하는 예제.
const EMPTY_SEARCH: BoardSearch = { type: 'title', keyword: '' }

export function useBoards(initialPage = 0, initialSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [size, setSize] = useState(initialSize)
  // 실제로 조회에 반영된(=커밋된) 검색 조건. 입력 중인 값은 SearchBar 가 따로 관리.
  const [search, setSearch] = useState<BoardSearch>(EMPTY_SEARCH)
  const [data, setData] = useState<PageResponse<Board> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 요청 순번. 조건이 연달아 바뀔 때(검색 직후 등) 이전 요청의 늦은 응답이
  // 최신 결과를 덮어쓰지 않도록 마지막 요청만 상태에 반영한다.
  const requestSeq = useRef(0)

  // page/size/search 가 바뀔 때마다 재생성되는 로더. reload() 로 수동 재조회도 가능.
  const load = useCallback(async () => {
    const seq = ++requestSeq.current
    setLoading(true)
    setError(null)
    try {
      const res = await fetchBoards(page, search, size)
      if (seq === requestSeq.current) setData(res)
    } catch (e) {
      if (seq === requestSeq.current)
        setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
    } finally {
      if (seq === requestSeq.current) setLoading(false)
    }
  }, [page, search, size])

  useEffect(() => {
    void load()
  }, [load])

  // 검색 실행: 조건을 커밋하고 항상 첫 페이지부터 다시 조회.
  const submitSearch = useCallback((next: BoardSearch) => {
    setSearch(next)
    setPage(0)
  }, [])

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
    search,
    submitSearch,
    reload: load,
  }
}
