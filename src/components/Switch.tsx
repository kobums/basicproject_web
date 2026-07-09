interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

// 켜짐/꺼짐 토글 스위치. 내부는 체크박스라 키보드/폼 호환.
export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: Readonly<SwitchProps>) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && <span>{label}</span>}
    </label>
  )
}
