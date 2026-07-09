import { useState } from 'react'
import type { ReactNode } from 'react'

export interface AccordionItem {
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean // true 면 여러 항목 동시 열기 허용
  defaultOpen?: number[] // 처음부터 열려 있을 인덱스
}

// 접었다 펴는 아코디언 목록.
export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
}: Readonly<AccordionProps>) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set(defaultOpen))

  const toggle = (index: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!multiple) next.clear()
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openSet.has(index)
        return (
          <div
            key={item.title}
            className={`accordion-item${isOpen ? ' open' : ''}`}
          >
            <button
              type="button"
              className="accordion-header"
              aria-expanded={isOpen}
              onClick={() => toggle(index)}
            >
              {item.title}
              <span className="accordion-arrow" aria-hidden="true" />
            </button>
            {isOpen && <div className="accordion-body">{item.content}</div>}
          </div>
        )
      })}
    </div>
  )
}
