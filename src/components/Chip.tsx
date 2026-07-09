interface ChipProps {
  label: string
  accent?: boolean // 강조 색상 (선택된 필터 등)
  onRemove?: () => void // 있으면 삭제(×) 버튼 표시
}

// 선택된 항목/태그를 표시하는 작은 칩. onRemove 를 주면 삭제 가능한 칩이 된다.
export function Chip({ label, accent = false, onRemove }: Readonly<ChipProps>) {
  return (
    <span className={`chip${accent ? ' chip-accent' : ''}`}>
      {label}
      {onRemove && (
        <button
          type="button"
          className="chip-remove"
          aria-label={`${label} 삭제`}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  )
}
