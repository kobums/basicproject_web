import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { Pagination } from '../components/Pagination'
import { Modal } from '../components/Modal'
import { deleteUser } from '../api/users'
import { useFeedback } from '../context/feedback'
import { formatDateTime } from '../lib/format'
import type { User } from '../types/user'

export function UserListPage() {
  const { data, loading, error, page, setPage, keyword, setKeyword, reload } =
    useUsers()
  const navigate = useNavigate()
  const isSearching = keyword.trim().length > 0
  const notify = useFeedback()
  const [target, setTarget] = useState<User | null>(null) // 삭제 확인 대상
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!target) return
    setDeleting(true)
    try {
      await deleteUser(target.id)
      setTarget(null)
      await reload()
      notify({ type: 'success', message: '회원이 삭제되었습니다.' })
    } catch (e) {
      notify({
        type: 'error',
        message: e instanceof Error ? e.message : '삭제에 실패했습니다.',
      })
    } finally {
      setDeleting(false)
    }
  }

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
          {isSearching && (
            <p className="search-result-info muted">
              ‘{keyword.trim()}’ 검색 결과 {data.totalElements}명
            </p>
          )}
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
                  <th className="col-actions">관리</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((user) => (
                  <tr
                    key={user.id}
                    className="row-clickable"
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                  >
                    <td className="col-id">{user.id}</td>
                    <td>{user.email}</td>
                    <td className="col-author">{user.name ?? '-'}</td>
                    <td className="col-date">
                      {formatDateTime(user.createdAt)}
                    </td>
                    <td
                      className="col-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        className="btn btn-sm"
                        to={`/users/${user.id}/edit`}
                      >
                        수정
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => setTarget(user)}
                      >
                        삭제
                      </button>
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

      <Modal
        open={target !== null}
        onClose={() => !deleting && setTarget(null)}
        title="회원 삭제"
        footer={
          <>
            <button
              type="button"
              className="btn"
              onClick={() => setTarget(null)}
              disabled={deleting}
            >
              취소
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '삭제 중…' : '삭제'}
            </button>
          </>
        }
      >
        {target && (
          <>
            <b>{target.name ?? `#${target.id}`}</b> ({target.email}) 회원을
            삭제하시겠습니까?
          </>
        )}
      </Modal>
    </section>
  )
}
