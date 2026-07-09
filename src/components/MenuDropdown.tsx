import { useEffect, useRef, useState } from 'react'

export interface MenuItem {
  label: string
  onClick: () => void
  danger?: boolean // 삭제 등 파괴적 동작은 빨간색
  divider?: boolean // true 면 이 항목 위에 구분선
}

interface MenuDropdownProps {
  items: MenuItem[]
  label?: string // 트리거 내용 (기본 ⋯ 아이콘)
}

// ⋯ 버튼을 누르면 나오는 액션 메뉴 (테이블 행의 수정/삭제 등).
export function MenuDropdown({ items, label = '⋯' }: Readonly<MenuDropdownProps>) {
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

  const run = (item: MenuItem) => {
    setOpen(false)
    item.onClick()
  }

  return (
    <div ref={rootRef} className="dropdown" style={{ minWidth: 'auto' }}>
      <button
        type="button"
        className="menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="메뉴"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>

      {open && (
        <ul className="dropdown-menu" role="menu" style={{ minWidth: 140 }}>
          {items.map((item) => (
            <li key={item.label}>
              {item.divider && <div className="dropdown-divider" />}
              <button
                type="button"
                role="menuitem"
                className={`dropdown-item${item.danger ? ' danger' : ''}`}
                onClick={() => run(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
