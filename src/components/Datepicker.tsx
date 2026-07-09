interface DatepickerProps {
  label?: string
  value: string // 'YYYY-MM-DD' 또는 ''
  onChange: (value: string) => void
  min?: string
  max?: string
  disabled?: boolean
}

// 네이티브 date input 래퍼. 라이브러리 없이 'YYYY-MM-DD' 문자열로 주고받는다.
export function Datepicker({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
}: Readonly<DatepickerProps>) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
      />
    </label>
  )
}
