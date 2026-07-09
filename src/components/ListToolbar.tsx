import { PageSizeSelect } from './PageSizeSelect'

interface ListToolbarProps {
  info: string // 결과 안내 문구 (예: "전체 21건", "'x' 검색 결과 3건")
  size: number
  onSizeChange: (size: number) => void
}

// 목록 위의 "결과 안내 + 페이지 크기 선택" 툴바.
export function ListToolbar({
  info,
  size,
  onSizeChange,
}: Readonly<ListToolbarProps>) {
  return (
    <div className="list-toolbar">
      <p className="search-result-info muted">{info}</p>
      <PageSizeSelect value={size} onChange={onSizeChange} />
    </div>
  )
}
