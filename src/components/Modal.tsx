import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode // 하단 버튼 영역 (없으면 닫기 버튼만)
  closeOnBackdrop?: boolean // 배경 클릭 시 닫기 (기본 true)
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
}: Readonly<ModalProps>) {
  // ESC 로 닫기 + 열려 있는 동안 배경 스크롤 잠금
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
    <div className="modal-backdrop">
      {/* 배경 클릭으로 닫기: role 꼼수 대신 실제 button 을 깔아 키보드 접근성 확보 */}
      {closeOnBackdrop && (
        <button
          type="button"
          className="modal-backdrop-button"
          aria-label="닫기"
          onClick={onClose}
        />
      )}
      <dialog className="modal" open aria-modal="true" aria-label={title}>
        {title && (
          <header className="modal-header">
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
        )}

        <div className="modal-body">{children}</div>

        <footer className="modal-footer">
          {footer ?? (
            <button type="button" className="btn" onClick={onClose}>
              닫기
            </button>
          )}
        </footer>
      </dialog>
    </div>,
    document.body,
  )
}
