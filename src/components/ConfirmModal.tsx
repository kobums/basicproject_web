import type { ReactNode } from 'react'
import { Modal } from './Modal'

interface ConfirmModalProps {
  open: boolean
  title: string
  onClose: () => void
  onConfirm: () => void
  confirmLabel?: string // 확인 버튼 라벨 (진행 중엔 "<라벨> 중…" 으로 바뀜)
  busy?: boolean // 진행 중: 버튼 비활성 + 닫기 차단
  danger?: boolean // 삭제처럼 파괴적인 동작이면 빨간 버튼
  children: ReactNode
}

// "취소 / 확인" footer 가 달린 확인 모달. 삭제 확인 등에 사용.
export function ConfirmModal({
  open,
  title,
  onClose,
  onConfirm,
  confirmLabel = '확인',
  busy = false,
  danger = false,
  children,
}: Readonly<ConfirmModalProps>) {
  // 진행 중에는 ESC/배경 클릭으로도 닫히지 않게 한다.
  const handleClose = () => {
    if (!busy) onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      footer={
        <>
          <button
            type="button"
            className="btn"
            onClick={handleClose}
            disabled={busy}
          >
            취소
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? `${confirmLabel} 중…` : confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  )
}
