import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ImageLightboxProps {
  src: string
  alt: string
  className?: string // 썸네일 img 에 얹을 클래스 (예: board-image)
}

// 클릭하면 전체 화면으로 확대되는 이미지. ESC/클릭으로 닫는다.
export function ImageLightbox({ src, alt, className }: Readonly<ImageLightboxProps>) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} 크게 보기`}
        style={{ border: 'none', padding: 0, background: 'none', cursor: 'zoom-in' }}
      >
        <img className={`lightbox-thumb${className ? ` ${className}` : ''}`} src={src} alt={alt} />
      </button>

      {open &&
        createPortal(
          <button
            type="button"
            className="lightbox-overlay"
            aria-label="닫기"
            onClick={() => setOpen(false)}
          >
            <img src={src} alt={alt} />
            <span className="lightbox-close" aria-hidden="true">
              ×
            </span>
          </button>,
          document.body,
        )}
    </>
  )
}
