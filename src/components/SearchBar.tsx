import { useState } from 'react'
import type { BoardSearch, SearchType } from '../types/board'

interface SearchBarProps {
  // 현재 커밋된 검색 조건(초기값/리셋 기준)
  value: BoardSearch
  onSearch: (search: BoardSearch) => void
}

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'all', label: '제목+내용' },
  { value: 'author', label: '작성자' },
]

// 게시판 목록 위에 놓이는 검색 입력줄. 입력 중인 값(draft)은 내부에서 관리하고,
// 제출/초기화 시에만 부모(useBoards)로 커밋한다.
export function SearchBar({ value, onSearch }: Readonly<SearchBarProps>) {
  const [type, setType] = useState<SearchType>(value.type)
  const [keyword, setKeyword] = useState(value.keyword)

  const handleSubmit = (e: React.FormEvent) => {
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
    <form className="search-bar" onSubmit={handleSubmit} role="search">
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
        placeholder="검색어를 입력하세요"
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
  )
}
