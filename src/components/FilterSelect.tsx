import { useEffect, useRef, useState } from 'react'

export interface FilterOption {
  label: string
  value: string
}

interface FilterSelectProps {
  title: string // 필터 이름 (예: "상태") — 트리거에 표시
  options: FilterOption[]
  values: string[] // 선택된 value 배열 (빈 배열 = 전체)
  onChange: (values: string[]) => void
  multi?: boolean // 다중 선택 (기본 true)
}

// 목록 상단에 두는 선택 필터. 선택이 없으면 "전체"로 간주하고,
// 다중 선택 시 첫 항목 + "외 N" 배지로 요약한다. (블루프린트 CommonFilter 포팅)
export function FilterSelect({
  title,
  options,
  values,
  onChange,
  multi = true,
}: Readonly<FilterSelectProps>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

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

  const toggle = (value: string) => {
    if (!multi) {
      onChange(values.includes(value) ? [] : [value])
      setOpen(false)
      return
    }
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value],
    )
  }

  const selectAll = () => {
    onChange([])
    if (!multi) setOpen(false)
  }

  // 트리거 요약: 전체 / 첫 선택 라벨 (+ 외 N)
  const firstLabel = options.find((opt) => opt.value === values[0])?.label
  const summary = values.length === 0 ? '전체' : firstLabel

  return (
    <div ref={rootRef} className={`dropdown${open ? ' open' : ''}`}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          {title}: {summary}
          {values.length > 1 && (
            <span className="filter-count-badge">외 {values.length - 1}</span>
          )}
        </span>
        <span className="dropdown-arrow" aria-hidden="true" />
      </button>

      {open && (
        <ul className="dropdown-menu" role="listbox">
          <li>
            <button
              type="button"
              className={`dropdown-item${values.length === 0 ? ' selected' : ''}`}
              onClick={selectAll}
            >
              전체
            </button>
          </li>
          {options.map((opt) =>
            multi ? (
              <li key={opt.value}>
                <label className="c-checkbox">
                  <input
                    type="checkbox"
                    checked={values.includes(opt.value)}
                    onChange={() => toggle(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              </li>
            ) : (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`dropdown-item${values.includes(opt.value) ? ' selected' : ''}`}
                  onClick={() => toggle(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}
