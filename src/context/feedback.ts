import { createContext, useContext } from 'react'

export type FeedbackType = 'success' | 'error'

export interface FeedbackOptions {
  type: FeedbackType
  message: string
  title?: string
  onClose?: () => void // 토스트가 사라질 때 실행 (선택). 보통 이동은 notify 직후 navigate 로 처리.
}

export type NotifyFn = (options: FeedbackOptions) => void

export const FeedbackContext = createContext<NotifyFn | null>(null)

// 성공/실패 피드백 다이얼로그를 띄우는 함수를 반환하는 훅
export function useFeedback(): NotifyFn {
  const notify = useContext(FeedbackContext)
  if (!notify) {
    throw new Error('useFeedback 는 FeedbackProvider 안에서만 사용할 수 있습니다.')
  }
  return notify
}
