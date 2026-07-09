import type { ReactNode } from 'react'

// 컬럼 정의(columns)로 헤더/셀을 그리는 제네릭 테이블.
// render 를 주면 셀을 커스텀(배지, 버튼 등)할 수 있고, 없으면 item[key] 를 문자열로 표시한다.
export interface DataTableColumn<T> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean // 헤더 클릭으로 정렬 (onSort 필요)
  render?: (item: T) => ReactNode
}

export type SortDir = 'asc' | 'desc'

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (item: T) => string | number
  onRowClick?: (item: T) => void
  emptyText?: string
  // 정렬 상태는 부모가 소유 (서버 정렬/로컬 정렬 모두 대응)
  sortKey?: string
  sortDir?: SortDir
  onSort?: (key: string) => void
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyText = '데이터가 없습니다.',
  sortKey,
  sortDir,
  onSort,
}: Readonly<DataTableProps<T>>) {
  const cellValue = (item: T, key: string): ReactNode => {
    const value = (item as Record<string, unknown>)[key]
    if (value == null) return '-'
    if (typeof value === 'string') return value
    if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      return String(value)
    }
    // 원시값이 아닌 컬럼은 render 로 그려야 한다. 객체가 오면 '[object Object]'
    // 대신 JSON 으로 보여 디버깅을 돕는다.
    return JSON.stringify(value)
  }

  const alignClass = (align?: DataTableColumn<T>['align']) =>
    align && align !== 'left' ? `cell-${align}` : undefined

  return (
    <table className="board-table data-table">
      <thead>
        <tr>
          {columns.map((col) => {
            const sortable = col.sortable && onSort
            const active = sortKey === col.key
            const thClass = [alignClass(col.align), sortable ? 'sortable' : '']
              .filter(Boolean)
              .join(' ')
            let ariaSort: 'ascending' | 'descending' | undefined
            if (active)
              ariaSort = sortDir === 'asc' ? 'ascending' : 'descending'
            return (
              <th
                key={col.key}
                className={thClass || undefined}
                style={col.width ? { width: col.width } : undefined}
                aria-sort={ariaSort}
                onClick={sortable ? () => onSort(col.key) : undefined}
              >
                {col.header}
                {active && (
                  <span className="sort-arrow" aria-hidden="true">
                    {sortDir === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td className="cell-center muted" colSpan={columns.length}>
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr
              key={rowKey(item)}
              className={onRowClick ? 'row-clickable' : undefined}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={alignClass(col.align)}>
                  {col.render ? col.render(item) : cellValue(item, col.key)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
