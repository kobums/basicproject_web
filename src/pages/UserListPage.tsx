import { Link, useNavigate } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { Pagination } from '../components/Pagination'
import { PageSizeSelect } from '../components/PageSizeSelect'
import { formatDateTime } from '../lib/format'

export function UserListPage() {
  const { data, loading, error, page, setPage, size, changeSize, keyword, setKeyword } =
    useUsers()
  const navigate = useNavigate()
  const isSearching = keyword.trim().length > 0

  return (
    <section className="page">
      <header className="page-header">
        <h1>회원</h1>
        <Link className="btn btn-primary" to="/users/new">
          회원 추가
        </Link>
      </header>

      <div className="search-bar" role="search">
        <input
          className="search-input"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          aria-label="회원 검색"
        />
      </div>

      {loading && !data && <p className="muted">불러오는 중…</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <div className="list-toolbar">
            <p className="search-result-info muted">
              {isSearching
                ? `‘${keyword.trim()}’ 검색 결과 ${data.totalElements}명`
                : `전체 ${data.totalElements}명`}
            </p>
            <PageSizeSelect value={size} onChange={changeSize} />
          </div>
          {data.content.length === 0 ? (
            <p className="muted">
              {isSearching
                ? '검색 결과가 없습니다.'
                : '등록된 회원이 없습니다.'}
            </p>
          ) : (
            <table className="board-table">
              <thead>
                <tr>
                  <th className="col-id">번호</th>
                  <th>이메일</th>
                  <th className="col-author">이름</th>
                  <th className="col-date">가입일</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((user) => (
                  <tr
                    key={user.id}
                    className="row-clickable"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <td className="col-id">{user.id}</td>
                    <td>{user.email}</td>
                    <td className="col-author">{user.name ?? '-'}</td>
                    <td className="col-date">
                      {formatDateTime(user.createdAt)}
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
