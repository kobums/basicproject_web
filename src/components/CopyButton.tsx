import { useEffect, useRef, useState } from 'react'

interface CopyButtonProps {
  text: string // 복사할 내용
  label?: string // 버튼 라벨 (기본 "복사")
}

// 클릭하면 text 를 클립보드에 복사하고 잠시 "복사됨 ✓" 을 보여준다.
export function CopyButton({ text, label = '복사' }: Readonly<CopyButtonProps>) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      // 클립보드 권한이 없으면 조용히 무시 (http 환경 등)
    }
  }

  return (
    <button
      type="button"
      className={`copy-btn${copied ? ' copied' : ''}`}
      onClick={handleCopy}
    >
      {copied ? '복사됨 ✓' : label}
    </button>
  )
}
