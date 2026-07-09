interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean // 우측에 현재 값 표시 (기본 true)
}

// 드래그로 값을 고르는 슬라이더 (네이티브 range 스타일링).
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
}: Readonly<SliderProps>) {
  return (
    <div className="slider-wrap">
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {showValue && <span className="slider-value">{value}</span>}
    </div>
  )
}
