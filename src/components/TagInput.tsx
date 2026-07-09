import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Chip } from './Chip'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  max?: number // 최대 태그 수
}

// Enter/쉼표로 태그를 추가하고 ×/Backspace 로 삭제하는 태그 입력.
export function TagInput({
  tags,
  onChange,
  placeholder = '입력 후 Enter',
  max,
}: Readonly<TagInputProps>) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const add = () => {
    const tag = draft.trim().replace(/,$/, '')
    setDraft('')
    if (!tag || tags.includes(tag)) return // 중복은 조용히 무시
    if (max && tags.length >= max) return
    onChange([...tags, tag])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 확정용 Enter 는 무시 (조합 중 keydown 이 한 번 더 발생)
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      // 입력이 비어 있을 때 Backspace → 마지막 태그 삭제
      onChange(tags.slice(0, -1))
    }
  }

  return (
    // 컨테이너 아무 곳이나 클릭해도 입력에 포커스되도록.
    // 정적 요소 클릭 핸들러라 role/키보드는 내부 input 이 담당한다.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="tag-input" onClick={() => inputRef.current?.focus()}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          accent
          onRemove={() => onChange(tags.filter((t) => t !== tag))}
        />
      ))}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        placeholder={tags.length === 0 ? placeholder : ''}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={add}
        aria-label="태그 입력"
      />
    </div>
  )
}
