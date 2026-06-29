interface PaginationProps {
  page: number // 0-based 현재 페이지
  totalPages: number
  onChange: (page: number) => void
  blockSize?: number // 한 번에 보여줄 페이지 번호 개수 (기본 10)
}

export function Pagination({
  page,
  totalPages,
  onChange,
  blockSize = 10,
}: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null

  // 현재 페이지가 속한 블록(10개 단위)의 시작/끝 페이지 (0-based)
  const currentBlock = Math.floor(page / blockSize)
  const startPage = currentBlock * blockSize
  const endPage = Math.min(startPage + blockSize - 1, totalPages - 1)

  const pages: number[] = []
  for (let p = startPage; p <= endPage; p++) pages.push(p)

  const isFirst = page <= 0
  const isLast = page >= totalPages - 1

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="page-btn"
        disabled={isFirst}
        onClick={() => onChange(0)}
      >
        « 맨처음
      </button>
      <button
        type="button"
        className="page-btn"
        disabled={isFirst}
        onClick={() => onChange(page - 1)}
      >
        ‹ 이전
      </button>

      <ul className="page-numbers">
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              className={`page-num${p === page ? ' active' : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
            >
              {p + 1}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="page-btn"
        disabled={isLast}
        onClick={() => onChange(page + 1)}
      >
        다음 ›
      </button>
      <button
        type="button"
        className="page-btn"
        disabled={isLast}
        onClick={() => onChange(totalPages - 1)}
      >
        맨나중 »
      </button>
    </nav>
  )
}
