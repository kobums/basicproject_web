import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { deleteUser } from '../api/users'
import { formatDateTime } from '../lib/format'
import { Modal } from '../components/Modal'
import { useFeedback } from '../context/feedback'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const navigate = useNavigate()
  const notify = useFeedback()
  const { user, loading, error } = useUser(userId)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteUser(userId)
      setConfirmOpen(false)
      notify({ type: 'success', message: '회원이 삭제되었습니다.' })
      navigate('/users')
    } catch (e) {
      setDeleting(false)
      setConfirmOpen(false)
      notify({
        type: 'error',
        message: e instanceof Error ? e.message : '삭제에 실패했습니다.',
      })
    }
  }

  if (loading) return <p className="muted page">불러오는 중…</p>
  if (error) return <p className="error page">{error}</p>
  if (!user) return null

  return (
    <section className="page user-detail">
      <h1>{user.name ?? `#${user.id}`}</h1>
      <dl className="detail-fields">
        <div>
          <dt>이메일</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>이름</dt>
          <dd>{user.name ?? '-'}</dd>
        </div>
        <div>
          <dt>가입일</dt>
          <dd>{formatDateTime(user.createdAt)}</dd>
        </div>
      </dl>

      <div className="board-form-actions">
        <Link className="btn" to="/users">
          목록
        </Link>
        <Link className="btn" to={`/users/${user.id}/edit`}>
          수정
        </Link>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setConfirmOpen(true)}
          disabled={deleting}
        >
          삭제
        </button>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        title="회원 삭제"
        footer={
          <>
            <button
              type="button"
              className="btn"
              onClick={() => setConfirmOpen(false)}
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
        <b>{user.name ?? `#${user.id}`}</b> ({user.email}) 회원을
        삭제하시겠습니까?
      </Modal>
    </section>
  )
}
