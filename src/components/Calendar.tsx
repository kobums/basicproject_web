import { useState } from 'react'

interface CalendarProps {
  value: string // 'YYYY-MM-DD' 또는 ''
  onChange: (value: string) => void
}

const DOW = ['일', '월', '화', '수', '목', '금', '토']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

// 월 그리드 달력. 이전/다음 달 이동, 오늘 강조, 날짜 선택.
// (Datepicker 가 네이티브 input 이라면, 이건 그리드를 직접 그리는 학습용 구현)
export function Calendar({ value, onChange }: Readonly<CalendarProps>) {
  const today = new Date()
  const selected = value ? new Date(`${value}T00:00:00`) : null

  // 보고 있는 달 (선택값이 있으면 그 달부터, 없으면 이번 달)
  const [viewYear, setViewYear] = useState(
    selected ? selected.getFullYear() : today.getFullYear(),
  )
  const [viewMonth, setViewMonth] = useState(
    selected ? selected.getMonth() : today.getMonth(),
  )

  const move = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  // 그리드 시작: 그 달 1일이 속한 주의 일요일부터 6주(42칸)
  const first = new Date(viewYear, viewMonth, 1)
  const start = new Date(viewYear, viewMonth, 1 - first.getDay())
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return d
  })

  const isSame = (a: Date, b: Date | null) =>
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  return (
    <div className="calendar">
      <div className="calendar-head">
        <button
          type="button"
          className="calendar-nav"
          aria-label="이전 달"
          onClick={() => move(-1)}
        >
          ‹
        </button>
        <span className="calendar-title">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          className="calendar-nav"
          aria-label="다음 달"
          onClick={() => move(1)}
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {DOW.map((d, i) => (
          <span key={d} className={`dow${i === 0 ? ' sun' : ''}`}>
            {d}
          </span>
        ))}
        {cells.map((d) => {
          const outside = d.getMonth() !== viewMonth
          const cls = [
            'calendar-day',
            outside ? 'outside' : '',
            isSame(d, today) ? 'today' : '',
            isSame(d, selected) ? 'selected' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={d.toISOString()}
              type="button"
              className={cls}
              onClick={() => onChange(toISO(d.getFullYear(), d.getMonth(), d.getDate()))}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
