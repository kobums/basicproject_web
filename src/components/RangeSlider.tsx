interface RangeSliderProps {
  start: number
  end: number
  onStartChange: (value: number) => void
  onEndChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

// 최소~최대 범위를 고르는 듀얼 썸 슬라이더 (가격대 필터 등).
// range input 두 개를 겹치고 썸만 클릭에 반응하게 해서 구현.
export function RangeSlider({
  start,
  end,
  onStartChange,
  onEndChange,
  min = 0,
  max = 100,
  step = 1,
}: Readonly<RangeSliderProps>) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="range-slider">
        <span className="range-track" aria-hidden="true" />
        <span
          className="range-fill"
          aria-hidden="true"
          style={{ left: `${pct(start)}%`, width: `${pct(end) - pct(start)}%` }}
        />
        <input
          type="range"
          value={start}
          min={min}
          max={max}
          step={step}
          aria-label="최소값"
          onChange={(e) => onStartChange(Math.min(Number(e.target.value), end))}
        />
        <input
          type="range"
          value={end}
          min={min}
          max={max}
          step={step}
          aria-label="최대값"
          onChange={(e) => onEndChange(Math.max(Number(e.target.value), start))}
        />
      </div>
      <span className="range-values">
        {start} ~ {end}
      </span>
    </div>
  )
}
