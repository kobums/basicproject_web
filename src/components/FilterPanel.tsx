import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface FilterPanelProps {
  label?: string // 트리거 버튼 라벨
  children: ReactNode // 필터 폼 (Input/Select/DateRangeFilter 등)
  onReset: () => void
  onSearch: () => void
}

// "상세검색" 버튼 + 팝오버 패널. children 으로 필터 폼을 받고
// 초기화/검색 버튼을 제공한다. 검색 시 패널이 닫힌다. (블루프린트 CommonFilterSearch 포팅)
export function FilterPanel({
  label = '상세검색',
  children,
  onReset,
  onSearch,
}: Readonly<FilterPanelProps>) {
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

  const handleSearch = () => {
    onSearch()
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="filter-panel-wrap">
      <button
        type="button"
        className="btn"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>

      {open && (
        <div className="filter-panel">
          <div className="filter-panel-body">{children}</div>
          <div className="filter-panel-actions">
            <button type="button" className="btn" onClick={onReset}>
              초기화
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
            >
              검색
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
