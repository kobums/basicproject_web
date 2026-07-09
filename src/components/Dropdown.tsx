import { useEffect, useRef, useState } from 'react'

export interface DropdownOption<T extends string | number> {
  label: string
  value: T
}

interface DropdownProps<T extends string | number> {
  options: DropdownOption<T>[]
  value: T | null
  onChange: (value: T | null) => void
  placeholder?: string
  resetLabel?: string // 있으면 맨 위에 선택 해제(전체) 항목 추가
  disabled?: boolean
}

// 네이티브 select 대신 목록을 직접 그리는 커스텀 드롭다운.
// 바깥 클릭 감지로 닫히며, value 는 string | number 제네릭.
export function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  resetLabel,
  disabled = false,
}: Readonly<DropdownProps<T>>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // 열려 있는 동안 바깥 클릭 → 닫기
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const selected = options.find((opt) => opt.value === value)

  const pick = (next: T | null) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`dropdown${open ? ' open' : ''}`}>
      <button
        type="button"
        className="dropdown-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span>{selected.label}</span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="dropdown-arrow" aria-hidden="true" />
      </button>

      {open && (
        <ul className="dropdown-menu" role="listbox">
          {resetLabel && (
            <li>
              <button
                type="button"
                className={`dropdown-item${value === null ? ' selected' : ''}`}
                onClick={() => pick(null)}
              >
                {resetLabel}
              </button>
            </li>
          )}
          {options.length === 0 && (
            <li className="dropdown-empty">선택 가능한 옵션이 없습니다.</li>
          )}
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                className={`dropdown-item${opt.value === value ? ' selected' : ''}`}
                onClick={() => pick(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
