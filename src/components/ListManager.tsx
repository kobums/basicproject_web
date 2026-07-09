import { useState } from 'react'
import type { KeyboardEvent } from 'react'

export interface ListManagerItem {
  id: number
  label: string
}

interface ListManagerProps {
  items: ListManagerItem[]
  onChange: (items: ListManagerItem[]) => void
  placeholder?: string
}

// 드래그로 순서를 바꾸고, 검색·추가·체크박스 선택 삭제까지 지원하는 리스트 관리자.
export function ListManager({
  items,
  onChange,
  placeholder = '새 항목 입력 후 Enter',
}: Readonly<ListManagerProps>) {
  const [keyword, setKeyword] = useState('')
  const [draft, setDraft] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [dragId, setDragId] = useState<number | null>(null)

  // 검색 중에는 보이는 순서와 실제 순서가 달라 드래그 정렬을 비활성화한다.
  const filtering = keyword.trim() !== ''
  const visible = filtering
    ? items.filter((it) =>
        it.label.toLowerCase().includes(keyword.trim().toLowerCase()),
      )
    : items

  const selectedCount = items.filter((it) => selected.has(it.id)).length
  const allChecked =
    visible.length > 0 && visible.every((it) => selected.has(it.id))

  const add = () => {
    const label = draft.trim()
    setDraft('')
    if (!label || items.some((it) => it.label === label)) return // 중복은 조용히 무시
    const nextId = items.reduce((max, it) => Math.max(max, it.id), 0) + 1
    onChange([...items, { id: nextId, label }])
  }

  const handleAddKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 확정용 Enter 는 무시 (조합 중 keydown 이 한 번 더 발생)
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  const toggle = (id: number, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const toggleAll = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      visible.forEach((it) => {
        if (checked) next.add(it.id)
        else next.delete(it.id)
      })
      return next
    })
  }

  const removeOne = (id: number) => {
    onChange(items.filter((it) => it.id !== id))
    toggle(id, false)
  }

  const removeSelected = () => {
    onChange(items.filter((it) => !selected.has(it.id)))
    setSelected(new Set())
  }

  // 드래그 중인 항목이 다른 항목 위로 올라오면 즉시 자리를 바꾼다(라이브 정렬).
  const handleDragEnter = (overId: number) => {
    if (dragId === null || dragId === overId) return
    const next = [...items]
    const from = next.findIndex((it) => it.id === dragId)
    const to = next.findIndex((it) => it.id === overId)
    next.splice(to, 0, next.splice(from, 1)[0])
    onChange(next)
  }

  return (
    <div className="list-manager">
      <div className="lm-toolbar">
        <label className="c-checkbox">
          <input
            type="checkbox"
            checked={allChecked}
            disabled={visible.length === 0}
            onChange={(e) => toggleAll(e.target.checked)}
            aria-label="전체 선택"
          />
        </label>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색"
          aria-label="항목 검색"
        />
        <button
          type="button"
          className="btn btn-sm btn-danger"
          disabled={selectedCount === 0}
          onClick={removeSelected}
        >
          선택 삭제{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </button>
      </div>

      <ul className="lm-list">
        {visible.map((item) => (
          <li
            key={item.id}
            className={`lm-item${dragId === item.id ? ' dragging' : ''}`}
            draggable={!filtering}
            onDragStart={() => setDragId(item.id)}
            onDragEnter={() => handleDragEnter(item.id)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={() => setDragId(null)}
          >
            {!filtering && (
              <span className="lm-handle" aria-hidden="true">
                ⠿
              </span>
            )}
            <label className="c-checkbox">
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={(e) => toggle(item.id, e.target.checked)}
                aria-label={`${item.label} 선택`}
              />
            </label>
            <span className="lm-label">{item.label}</span>
            <button
              type="button"
              className="lm-remove"
              onClick={() => removeOne(item.id)}
              aria-label={`${item.label} 삭제`}
            >
              ×
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="lm-empty">
            {filtering ? '검색 결과가 없습니다.' : '항목이 없습니다.'}
          </li>
        )}
      </ul>

      <div className="lm-add">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleAddKeyDown}
          placeholder={placeholder}
          aria-label="새 항목"
        />
        <button type="button" className="btn btn-sm" onClick={add}>
          추가
        </button>
      </div>
      {filtering && (
        <p className="lm-hint">검색 중에는 드래그 정렬이 비활성화됩니다.</p>
      )}
    </div>
  )
}
