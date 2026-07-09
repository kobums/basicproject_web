// 상태를 색상으로 구분해 보여주는 알약 배지
export type BadgeVariant = 'green' | 'red' | 'gray' | 'blue' | 'purple'

interface StatusBadgeProps {
  label: string
  variant: BadgeVariant
}

export function StatusBadge({ label, variant }: Readonly<StatusBadgeProps>) {
  return <span className={`badge badge-${variant}`}>{label}</span>
}
