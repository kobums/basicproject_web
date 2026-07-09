import type { ReactNode } from 'react'

export interface DescriptionItem {
  label: string
  value: ReactNode
}

interface DescriptionListProps {
  items: DescriptionItem[]
}

// "라벨: 값" 쌍을 표 형태로 나열하는 상세 정보 목록 (회원 상세 등).
// 스타일은 board.css 의 .detail-fields 를 재사용한다.
export function DescriptionList({ items }: Readonly<DescriptionListProps>) {
  return (
    <dl className="detail-fields">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
