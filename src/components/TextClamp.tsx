import { useEffect, useRef, useState } from 'react'

interface TextClampProps {
  text: string
  lines?: number // 접었을 때 보여줄 줄 수
}

// 긴 텍스트를 n줄로 접고 "더보기/접기" 로 토글.
// 실제로 넘칠 때만 버튼을 보여준다 (scrollHeight 측정).
export function TextClamp({ text, lines = 3 }: Readonly<TextClampProps>) {
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const pRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = pRef.current
    if (!el) return
    // 접힌 상태 기준으로 넘침 여부 판단
    setOverflowing(el.scrollHeight > el.clientHeight + 1)
  }, [text, lines])

  return (
    <div className="text-clamp">
      <p
        ref={pRef}
        className={expanded ? '' : 'clamped'}
        style={expanded ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          className="clamp-toggle"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  )
}
