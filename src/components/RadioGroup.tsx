import type { CheckOption } from './CheckboxGroup'

interface RadioGroupProps {
  name: string // 라디오 그룹명 (페이지 내 유일해야 함)
  options: CheckOption[]
  value: string
  onChange: (value: string) => void
  vertical?: boolean
  disabled?: boolean
}

// 여러 항목 중 하나만 선택하는 라디오 그룹.
export function RadioGroup({
  name,
  options,
  value,
  onChange,
  vertical = false,
  disabled = false,
}: Readonly<RadioGroupProps>) {
  return (
    <div className={`check-group${vertical ? ' vertical' : ''}`}>
      {options.map((opt) => (
        <label key={opt.value} className="c-radio">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            disabled={disabled}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
