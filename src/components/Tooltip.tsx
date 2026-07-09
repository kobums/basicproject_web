import { useId } from 'react'
import type { ReactNode } from 'react'

interface TooltipProps {
  text: string
  children?: ReactNode // 없으면 ⓘ 아이콘을 트리거로 사용
}

// hover/focus 시 말풍선을 띄우는 CSS 기반 툴팁.
// 트리거는 네이티브 button 이라 키보드 포커스로도 말풍선이 뜬다(:focus-within).
export function Tooltip({ text, children }: Readonly<TooltipProps>) {
  const tooltipId = useId()
  return (
    <span className="tooltip-wrap">
      <button
        type="button"
        className="tooltip-trigger"
        aria-describedby={tooltipId}
      >
        {children ?? <InfoIcon />}
      </button>
      <span id={tooltipId} className="tooltip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  )
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-label="도움말"
      role="img"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
