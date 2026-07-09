import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

// 오른쪽에서 슬라이드되어 나오는 사이드 패널. ESC/배경 클릭으로 닫힌다.
export function Drawer({ open, onClose, title, children }: Readonly<DrawerProps>) {
  // ESC 닫기 + 열려 있는 동안 배경 스크롤 잠금 (Modal 과 동일한 패턴)
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <>
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="닫기"
        onClick={onClose}
        style={{ border: 'none', padding: 0, cursor: 'default' }}
      />
      <aside className="drawer" aria-label={title}>
        <header className="drawer-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="modal-close"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="drawer-body">{children}</div>
      </aside>
    </>,
    document.body,
  )
}
