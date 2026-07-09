import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useBoard } from '../hooks/useBoard'
import { deleteBoard } from '../api/boards'
import { formatDateTime } from '../lib/format'
import { ConfirmModal } from '../components/ConfirmModal'
import { ImageLightbox } from '../components/ImageLightbox'
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
        <ImageLightbox
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

      <ConfirmModal
        open={confirmOpen}
        title="게시글 삭제"
        danger
        busy={deleting}
        confirmLabel="삭제"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      >
        이 게시글을 정말 삭제하시겠습니까?
      </ConfirmModal>
    </section>
  )
}
