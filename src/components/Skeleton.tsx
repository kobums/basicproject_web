interface SkeletonProps {
  width?: string // 기본 100%
  height?: string // 기본 16px
  circle?: boolean
}

// 로딩 중 자리 표시자 (shimmer 애니메이션).
export function Skeleton({
  width = '100%',
  height = '16px',
  circle = false,
}: Readonly<SkeletonProps>) {
  return (
    <span
      className={`skeleton${circle ? ' circle' : ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
