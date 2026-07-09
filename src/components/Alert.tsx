import { useState } from 'react'
import type { ReactNode } from 'react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  closable?: boolean // 닫기(×) 버튼 표시
}

// 페이지 안에 고정으로 놓는 안내/경고 배너. (토스트와 달리 사라지지 않음)
export function Alert({
  variant = 'info',
  title,
  children,
  closable = false,
}: Readonly<AlertProps>) {
  const [closed, setClosed] = useState(false)
  if (closed) return null

  return (
    <div className={`alert alert-${variant}`} role="alert">
      <span className="alert-icon" aria-hidden="true">
        <AlertIcon variant={variant} />
      </span>
      <div className="alert-body">
        {title && <strong className="alert-title">{title}</strong>}
        {children}
      </div>
      {closable && (
        <button
          type="button"
          className="alert-close"
          aria-label="닫기"
          onClick={() => setClosed(true)}
        >
          ×
        </button>
      )}
    </div>
  )
}

function AlertIcon({ variant }: Readonly<{ variant: AlertVariant }>) {
  // 원 안에 i / ✓ / ! 를 그리는 공용 아이콘
  const mark = { info: 'i', success: '✓', warning: '!', error: '!' }[variant]
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="currentColor"
      >
        {mark}
      </text>
    </svg>
  )
}
