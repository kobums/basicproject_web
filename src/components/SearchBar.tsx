import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// 검색 조건 = 생성 API 의 목록 필터 이름 (BoardSearchParams 의 title / content).
// gomachine 문자열 필터는 모든 백엔드(Go / Spring / Rust)에서 부분 일치(like '%검색어%')다.
export type SearchType = 'title' | 'content'

export interface BoardSearch {
  type: SearchType
  keyword: string
}

interface SearchBarProps {
  // 현재 커밋된 검색 조건(초기값/리셋 기준)
  value: BoardSearch
  onSearch: (search: BoardSearch) => void
}

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
]

// 게시판 목록 위에 놓이는 검색 입력줄. 입력 중인 값(draft)은 내부에서 관리하고,
// 제출/초기화 시에만 부모(BoardListPage)로 커밋한다.
export function SearchBar({ value, onSearch }: Readonly<SearchBarProps>) {
  const [type, setType] = useState<SearchType>(value.type)
  const [keyword, setKeyword] = useState(value.keyword)

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch({ type, keyword: keyword.trim() })
  }

  const handleReset = () => {
    setType('title')
    setKeyword('')
    onSearch({ type: 'title', keyword: '' })
  }

  // 현재 전체 목록(검색 안 함) 상태인지 — 초기화 버튼 노출 여부 판단
  const hasActiveSearch = value.keyword.trim().length > 0

  return (
    <search>
      <form className="search-bar" onSubmit={handleSubmit}>
        <select
          className="search-type"
          value={type}
          onChange={(e) => setType(e.target.value as SearchType)}
          aria-label="검색 조건"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          className="search-input"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 (일부만 입력해도 찾는다)"
          aria-label="검색어"
        />

        <button type="submit" className="btn btn-primary">
          검색
        </button>

        {hasActiveSearch && (
          <button type="button" className="btn" onClick={handleReset}>
            초기화
          </button>
        )}
      </form>
    </search>
  )
}
