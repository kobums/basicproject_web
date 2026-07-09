interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

// −/＋ 버튼이 달린 숫자 입력. min/max 로 클램프한다.
export function NumberInput({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
}: Readonly<NumberInputProps>) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const handleInput = (raw: string) => {
    const n = Number(raw)
    if (!Number.isNaN(n)) onChange(clamp(n))
  }

  return (
    <div className="number-input">
      <button
        type="button"
        aria-label="감소"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - step))}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => handleInput(e.target.value)}
      />
      <button
        type="button"
        aria-label="증가"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + step))}
      >
        ＋
      </button>
    </div>
  )
}
