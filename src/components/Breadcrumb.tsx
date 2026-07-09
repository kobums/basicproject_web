import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string // 없으면 링크 없이 텍스트 (보통 마지막 항목)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

// 현재 위치 경로 표시 (Home / 그룹 / 현재).
export function Breadcrumb({ items }: Readonly<BreadcrumbProps>) {
  return (
    <nav aria-label="현재 위치">
      <ol className="breadcrumb">
        {items.map((item) => (
          <li key={item.label}>
            {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  )
}
