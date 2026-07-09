import { useEffect, useId, useRef, useState } from 'react'

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[] // 전체 후보 (입력값으로 부분 일치 필터)
  placeholder?: string
}

// 입력하면 후보가 필터되어 나오는 자동완성 입력.
// 일치 부분은 <mark> 로 강조하고, 항목 클릭으로 확정한다.
export function Combobox({
  value,
  onChange,
  options,
  placeholder = '입력하여 검색',
}: Readonly<ComboboxProps>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

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

  const keyword = value.trim().toLowerCase()
  const filtered = keyword
    ? options.filter((opt) => opt.toLowerCase().includes(keyword))
    : options

  // 일치 부분 강조: 앞/일치/뒤 세 조각으로 나눠 렌더
  const highlight = (option: string) => {
    if (!keyword) return option
    const index = option.toLowerCase().indexOf(keyword)
    if (index < 0) return option
    return (
      <>
        {option.slice(0, index)}
        <mark>{option.slice(index, index + keyword.length)}</mark>
        {option.slice(index + keyword.length)}
      </>
    )
  }

  const pick = (option: string) => {
    onChange(option)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="combobox">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
      />

      {open && (
        <ul id={listboxId} className="dropdown-menu" role="listbox">
          {filtered.length === 0 && (
            <li className="dropdown-empty">일치하는 항목이 없습니다.</li>
          )}
          {filtered.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                className="dropdown-item"
                onClick={() => pick(opt)}
              >
                {highlight(opt)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
