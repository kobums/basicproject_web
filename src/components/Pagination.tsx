interface PaginationProps {
  page: number // 현재 페이지 (1 부터, gomachine API 의 page 와 같다)
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

  // 현재 페이지가 속한 블록(10개 단위)의 시작/끝 페이지 (1 부터)
  const currentBlock = Math.floor((page - 1) / blockSize)
  const startPage = currentBlock * blockSize + 1
  const endPage = Math.min(startPage + blockSize - 1, totalPages)

  const pages: number[] = []
  for (let p = startPage; p <= endPage; p++) pages.push(p)

  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="page-btn"
        disabled={isFirst}
        onClick={() => onChange(1)}
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
              {p}
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
        onClick={() => onChange(totalPages)}
      >
        맨나중 »
      </button>
    </nav>
  )
}
