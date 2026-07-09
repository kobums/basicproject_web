import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  extra?: ReactNode // 헤더 우측 영역 (버튼 등)
  footer?: ReactNode
  children: ReactNode
}

// 테두리+라운드 컨테이너. 헤더/본문/푸터 구조.
export function Card({ title, extra, footer, children }: Readonly<CardProps>) {
  return (
    <div className="card">
      {(title || extra) && (
        <div className="card-header">
          <span>{title}</span>
          {extra}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}
