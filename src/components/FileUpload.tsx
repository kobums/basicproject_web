import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

interface FileUploadProps {
  files: File[]
  onChange: (files: File[]) => void
  accept?: string // 예: 'image/*'
  multiple?: boolean
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// 클릭 또는 드래그&드롭으로 파일을 고르는 업로드 영역. 선택 목록 + 개별 삭제 제공.
export function FileUpload({
  files,
  onChange,
  accept,
  multiple = false,
}: Readonly<FileUploadProps>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragover, setDragover] = useState(false)

  const addFiles = (added: File[]) => {
    if (added.length === 0) return
    onChange(multiple ? [...files, ...added] : added.slice(0, 1))
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []))
    e.target.value = '' // 같은 파일 재선택 가능하도록 리셋
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragover(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <button
        type="button"
        className={`file-drop${dragover ? ' dragover' : ''}`}
        style={{ width: '100%', font: 'inherit', background: 'none' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragover(true)
        }}
        onDragLeave={() => setDragover(false)}
        onDrop={handleDrop}
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>
          클릭하거나 파일을 끌어다 놓으세요
          {multiple ? ' (여러 개 가능)' : ''}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInput}
        />
      </button>

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <span>{file.name}</span>
              <span className="file-size">{formatSize(file.size)}</span>
              <button
                type="button"
                className="file-remove"
                aria-label={`${file.name} 삭제`}
                onClick={() => remove(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
