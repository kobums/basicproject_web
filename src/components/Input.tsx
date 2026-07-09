interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  hint?: string // 입력 안내 (error 가 있으면 error 우선 표시)
  error?: string
  multiline?: boolean
  rows?: number
  maxLength?: number
  disabled?: boolean
  required?: boolean
}

// 라벨 + 입력 + 안내/에러 문구를 묶은 제어형 텍스트 입력.
export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
  error,
  multiline = false,
  rows = 4,
  maxLength = 255,
  disabled = false,
  required = false,
}: Readonly<InputProps>) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
      )}
      {hint && !error && <small className="field-hint">{hint}</small>}
      {error && <em className="field-error">{error}</em>}
    </label>
  )
}
