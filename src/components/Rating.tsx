interface RatingProps {
  value: number // 0~max
  onChange?: (value: number) => void // 없으면 읽기 전용
  max?: number
}

// 별점 입력/표시. 같은 별을 다시 누르면 0점으로 해제된다.
export function Rating({ value, onChange, max = 5 }: Readonly<RatingProps>) {
  const readonly = !onChange
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div
      className={`rating${readonly ? ' readonly' : ''}`}
      role="radiogroup"
      aria-label={`별점 ${value}/${max}`}
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={`${star}점`}
          className={star <= value ? 'filled' : ''}
          tabIndex={readonly ? -1 : 0}
          onClick={() => onChange?.(star === value ? 0 : star)}
        >
          ★
        </button>
      ))}
    </div>
  )
}
