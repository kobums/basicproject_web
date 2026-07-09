import { useState } from 'react'
import type { ChangeEvent, SyntheticEvent } from 'react'
import { Input } from './Input'

export interface BoardFormValues {
  title: string
  content: string
  image: File | null
}

interface BoardFormProps {
  mode: 'create' | 'edit'
  initialTitle?: string
  initialContent?: string
  currentImgUrl?: string | null
  submitting: boolean
  fieldErrors?: Record<string, string>
  onSubmit: (values: BoardFormValues) => void
  onCancel: () => void
}

export function BoardForm({
  mode,
  initialTitle = '',
  initialContent = '',
  currentImgUrl,
  submitting,
  fieldErrors = {},
  onSubmit,
  onCancel,
}: Readonly<BoardFormProps>) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [image, setImage] = useState<File | null>(null)

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] ?? null)
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit({ title, content, image })
  }

  // 중첩 삼항을 피하려 제출 버튼 라벨을 미리 계산
  const actionLabel = mode === 'create' ? '등록' : '수정'

  return (
    <form className="board-form" onSubmit={handleSubmit}>
      <Input
        label="제목"
        value={title}
        onChange={setTitle}
        placeholder="제목을 입력하세요"
        error={fieldErrors.title}
      />

      <Input
        label="내용"
        value={content}
        onChange={setContent}
        multiline
        rows={8}
        placeholder="내용을 입력하세요 (최대 255자)"
        error={fieldErrors.content}
      />

      <div className="field">
        <span>이미지{mode === 'create' ? ' (선택)' : ' (변경 시에만 선택)'}</span>
        {mode === 'edit' && currentImgUrl && (
          <img className="img-preview" src={currentImgUrl} alt="현재 이미지" />
        )}
        <input type="file" accept="image/*" onChange={handleFile} />
        {image && <small className="muted">선택됨: {image.name}</small>}
        {fieldErrors.image && (
          <em className="field-error">{fieldErrors.image}</em>
        )}
      </div>

      <div className="board-form-actions">
        <button
          type="button"
          className="btn"
          onClick={onCancel}
          disabled={submitting}
        >
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '저장 중…' : actionLabel}
        </button>
      </div>
    </form>
  )
}
