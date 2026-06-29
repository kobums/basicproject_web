import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useBoard } from '../hooks/useBoard'
import { deleteBoard } from '../api/boards'
import { formatDateTime } from '../lib/format'
import { Modal } from '../components/Modal'
import { useFeedback } from '../context/feedback'

export function BoardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)
  const navigate = useNavigate()
  const notify = useFeedback()
  const { board, loading, error } = useBoard(boardId)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBoard(boardId)
      setConfirmOpen(false)
      notify({ type: 'success', message: '게시글이 삭제되었습니다.' })
      navigate('/')
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
  if (!board) return null

  return (
    <section className="page board-detail">
      <h1>{board.title ?? '(제목 없음)'}</h1>
      <div className="board-meta">
        <span>작성자 {board.author.name ?? `#${board.author.id}`}</span>
        <span>{formatDateTime(board.createdAt)}</span>
      </div>

      {board.imgUrl && (
        <img
          className="board-image"
          src={board.imgUrl}
          alt={board.title ?? '게시글 이미지'}
        />
      )}

      <article className="board-content">{board.content}</article>

      <div className="board-form-actions">
        <Link className="btn" to="/">
          목록
        </Link>
        <Link className="btn" to={`/boards/${board.id}/edit`}>
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
        title="게시글 삭제"
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
        이 게시글을 정말 삭제하시겠습니까?
      </Modal>
    </section>
  )
}
