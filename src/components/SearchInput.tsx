interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void // Enter 또는 돋보기 클릭 시 호출
  placeholder?: string
}

// 돋보기 버튼이 달린 검색 입력창. Enter 제출을 위해 form 으로 감싼다.
export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = '검색어를 입력하세요',
}: Readonly<SearchInputProps>) {
  return (
    <search>
      <form
        className="search-field"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
      >
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="검색어"
        />
        <button type="submit" aria-label="검색">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
    </search>
  )
}
