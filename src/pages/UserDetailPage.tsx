import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { deleteUser } from '../api/users'
import { formatDateTime } from '../lib/format'
import { ConfirmModal } from '../components/ConfirmModal'
import { DescriptionList } from '../components/DescriptionList'
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
      <DescriptionList
        items={[
          { label: '이메일', value: user.email },
          { label: '이름', value: user.name ?? '-' },
          { label: '가입일', value: formatDateTime(user.createdAt) },
        ]}
      />

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

      <ConfirmModal
        open={confirmOpen}
        title="회원 삭제"
        danger
        busy={deleting}
        confirmLabel="삭제"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      >
        <b>{user.name ?? `#${user.id}`}</b> ({user.email}) 회원을
        삭제하시겠습니까?
      </ConfirmModal>
    </section>
  )
}
