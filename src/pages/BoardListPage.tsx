import { Link, useNavigate } from 'react-router-dom'
import { useBoards } from '../hooks/useBoards'
import { Pagination } from '../components/Pagination'
import { SearchBar } from '../components/SearchBar'
import { formatDateTime } from '../lib/format'

// 첨부 이미지가 있는 글의 제목 옆에 붙이는 작은 아이콘
function ImageIcon() {
  return (
    <svg
      className="title-img-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="이미지 첨부"
      role="img"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}

export function BoardListPage() {
  const { data, loading, error, page, setPage, search, submitSearch } =
    useBoards()
  const navigate = useNavigate()

  const isSearching = search.keyword.trim().length > 0

  return (
    <section className="page">
      <header className="page-header">
        <h1>게시판</h1>
        <Link className="btn btn-primary" to="/boards/new">
          글쓰기
        </Link>
      </header>

      <SearchBar value={search} onSearch={submitSearch} />

      {loading && <p className="muted">불러오는 중…</p>}
      {error && <p className="error">{error}</p>}

      {data && !loading && (
        <>
          {isSearching && (
            <p className="search-result-info muted">
              ‘{search.keyword.trim()}’ 검색 결과 {data.totalElements}건
            </p>
          )}
          {data.content.length === 0 ? (
            <p className="muted">
              {isSearching
                ? '검색 결과가 없습니다.'
                : '등록된 글이 없습니다.'}
            </p>
          ) : (
            <table className="board-table">
              <thead>
                <tr>
                  <th className="col-id">번호</th>
                  <th className="col-title">제목</th>
                  <th className="col-author">작성자</th>
                  <th className="col-date">작성일</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((board) => (
                  <tr
                    key={board.id}
                    className="row-clickable"
                    onClick={() => navigate(`/boards/${board.id}`)}
                  >
                    <td className="col-id">{board.id}</td>
                    <td className="col-title">
                      <span className="title-text">
                        {board.title ?? '(제목 없음)'}
                      </span>
                      {board.imgUrl && <ImageIcon />}
                    </td>
                    <td className="col-author">
                      {board.author.name ?? `#${board.author.id}`}
                    </td>
                    <td className="col-date">
                      {formatDateTime(board.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </section>
  )
}
