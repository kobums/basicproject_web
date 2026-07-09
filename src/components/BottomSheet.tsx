import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

// 아래에서 올라오는 시트 (모바일 친화 오버레이). ESC/배경 클릭으로 닫힌다.
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: Readonly<BottomSheetProps>) {
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
        className="sheet-backdrop"
        aria-label="닫기"
        onClick={onClose}
      />
      <dialog>
        <div className="bottom-sheet" aria-modal="true" aria-label={title}>
          <span className="sheet-handle" aria-hidden="true" />
          <header className="sheet-header">
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
          <div className="sheet-body">{children}</div>
        </div>
      </dialog>
    </>,
    document.body,
  )
}
