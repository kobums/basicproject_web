interface PageSizeSelectProps {
  value: number
  onChange: (size: number) => void
  options?: number[] // 선택 가능한 페이지 크기 (기본 10/20/50/100)
}

const DEFAULT_OPTIONS = [10, 20, 50, 100]

// 목록 페이지 크기를 고르는 드롭다운.
// 접근성·모바일 호환을 위해 네이티브 <select> 를 쓰되, 래퍼 + CSS 로 우리 디자인을 입힌다.
export function PageSizeSelect({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: Readonly<PageSizeSelectProps>) {
  return (
    <div className="select-wrap">
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="페이지당 표시 개수"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}개씩 보기
          </option>
        ))}
      </select>
    </div>
  )
}
