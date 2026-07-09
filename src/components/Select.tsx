export interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// 네이티브 <select> 래퍼. 접근성/모바일 호환을 유지하면서 .select-wrap CSS 로 디자인을 입힌다.
export function Select({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: Readonly<SelectProps>) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <div className="select-wrap">
        <select
          className="select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}
