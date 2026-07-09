interface CheckboxProps {
  id: string | number
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  name?: string
  disabled?: boolean
}

// 제어형 단일 체크박스. id 로 input/label 을 연결한다.
export function Checkbox({
  id,
  checked,
  onChange,
  label,
  name,
  disabled = false,
}: Readonly<CheckboxProps>) {
  return (
    <label className="c-checkbox" htmlFor={`chk-${id}`}>
      <input
        id={`chk-${id}`}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && <span>{label}</span>}
    </label>
  )
}
