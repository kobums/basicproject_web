import { Checkbox } from './Checkbox'

export interface CheckOption {
  label: string
  value: string
}

interface CheckboxGroupProps {
  name: string // 체크박스 id prefix (페이지 내 유일해야 함)
  options: CheckOption[]
  values: string[] // 선택된 value 배열
  onChange: (values: string[]) => void
  vertical?: boolean
  disabled?: boolean
}

// 여러 항목 중 다중 선택하는 체크박스 그룹. 선택된 value 배열로 주고받는다.
export function CheckboxGroup({
  name,
  options,
  values,
  onChange,
  vertical = false,
  disabled = false,
}: Readonly<CheckboxGroupProps>) {
  const toggle = (value: string, checked: boolean) => {
    onChange(
      checked ? [...values, value] : values.filter((v) => v !== value),
    )
  }

  return (
    <div className={`check-group${vertical ? ' vertical' : ''}`}>
      {options.map((opt) => (
        <Checkbox
          key={opt.value}
          id={`${name}-${opt.value}`}
          name={name}
          label={opt.label}
          checked={values.includes(opt.value)}
          onChange={(checked) => toggle(opt.value, checked)}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
