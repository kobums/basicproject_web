export interface TimelineItem {
  title: string
  time?: string
  description?: string
  muted?: boolean // 아직 안 일어난/비활성 이벤트는 회색 점
}

interface TimelineProps {
  items: TimelineItem[]
}

// 시간순 이벤트를 세로로 나열하는 타임라인 (이력, 활동 로그 등).
export function Timeline({ items }: Readonly<TimelineProps>) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={item.title} className={item.muted ? 'muted-dot' : ''}>
          <span className="timeline-dot" aria-hidden="true" />
          {item.time && <span className="timeline-time">{item.time}</span>}
          <span className="timeline-title">{item.title}</span>
          {item.description && (
            <p className="timeline-desc">{item.description}</p>
          )}
        </li>
      ))}
    </ol>
  )
}
