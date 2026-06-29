import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FeedbackContext } from '../context/feedback'
import type { FeedbackOptions } from '../context/feedback'

interface FeedbackProviderProps {
  children: ReactNode
}

interface ToastItem extends FeedbackOptions {
  id: number
}

// 타입별 자동 사라짐 시간(ms). 성공은 짧게, 오류는 충분히 읽을 시간을 준다.
const AUTO_DISMISS_MS: Record<FeedbackOptions['type'], number> = {
  success: 2000,
  error: 5000,
}

// 앱 전역 토스트 알림 Provider.
// 페이지에서는 useFeedback() 으로 notify({ type, message, onClose }) 호출.
// onClose 는 토스트가 사라질 때(자동/수동) 한 번 실행된다(예: 목록으로 이동).
export function FeedbackProvider({ children }: Readonly<FeedbackProviderProps>) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback((options: FeedbackOptions) => {
    idRef.current += 1
    setToasts((prev) => [...prev, { ...options, id: idRef.current }])
  }, [])

  return (
    <FeedbackContext.Provider value={notify}>
      {children}
      {createPortal(
        <div className="toast-stack" aria-live="polite">
          {toasts.map((t) => (
            <Toast key={t.id} item={t} onRemove={remove} />
          ))}
        </div>,
        document.body,
      )}
    </FeedbackContext.Provider>
  )
}

function Toast({
  item,
  onRemove,
}: Readonly<{ item: ToastItem; onRemove: (id: number) => void }>) {
  // 자동 타이머와 수동 닫기가 겹쳐도 onClose 가 두 번 실행되지 않도록 가드
  const finishedRef = useRef(false)
  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    item.onClose?.()
    onRemove(item.id)
  }, [item, onRemove])

  useEffect(() => {
    const timer = setTimeout(finish, AUTO_DISMISS_MS[item.type])
    return () => clearTimeout(timer)
  }, [finish, item.type])

  const isSuccess = item.type === 'success'
  return (
    <output className={`toast toast-${item.type}`}>
      <span className="toast-icon" aria-hidden="true">
        {isSuccess ? '✓' : '!'}
      </span>
      <div className="toast-body">
        {item.title && <strong className="toast-title">{item.title}</strong>}
        <p className="toast-message">{item.message}</p>
      </div>
      <button
        type="button"
        className="toast-close"
        aria-label="닫기"
        onClick={finish}
      >
        ×
      </button>
    </output>
  )
}
