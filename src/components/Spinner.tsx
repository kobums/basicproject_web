interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

// 회전 로딩 인디케이터
export function Spinner({ size = 'md' }: Readonly<SpinnerProps>) {
  const sizeClass = size === 'md' ? '' : ` spinner-${size}`
  return (
    <span className={`spinner${sizeClass}`} role="status" aria-label="로딩 중" />
  )
}
