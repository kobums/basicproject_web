interface DateRangeFilterProps {
  label?: string
  start: string // 'YYYY-MM-DD' 또는 ''
  end: string
  onStartChange: (date: string) => void
  onEndChange: (date: string) => void
}

// 시작일~종료일 범위 입력. 시작일 max=종료일, 종료일 min=시작일로 서로 제한해
// 역전된 범위를 만들 수 없게 한다.
export function DateRangeFilter({
  label,
  start,
  end,
  onStartChange,
  onEndChange,
}: Readonly<DateRangeFilterProps>) {
  return (
    <div className="field">
      {label && <span>{label}</span>}
      <div className="date-range">
        <input
          type="date"
          value={start}
          max={end || undefined}
          onChange={(e) => onStartChange(e.target.value)}
          aria-label="시작일"
        />
        <span className="tilde">~</span>
        <input
          type="date"
          value={end}
          min={start || undefined}
          onChange={(e) => onEndChange(e.target.value)}
          aria-label="종료일"
        />
      </div>
    </div>
  )
}
