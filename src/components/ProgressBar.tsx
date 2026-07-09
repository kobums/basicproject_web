interface ProgressBarProps {
  value: number // 0~100
  label?: string // 있으면 위에 "라벨  N%" 표시
}

// 진행률 바. value 는 0~100 으로 클램프된다.
export function ProgressBar({ value, label }: Readonly<ProgressBarProps>) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="progress-bar" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
