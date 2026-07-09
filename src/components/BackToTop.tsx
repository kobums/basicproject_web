import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface BackToTopProps {
  threshold?: number // 이만큼 스크롤해야 버튼 표시 (px)
}

// 스크롤을 내리면 우하단에 나타나는 "맨 위로" 플로팅 버튼.
export function BackToTop({ threshold = 300 }: Readonly<BackToTopProps>) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  if (!visible) return null

  return createPortal(
    <button
      type="button"
      className="back-to-top"
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>,
    document.body,
  )
}
