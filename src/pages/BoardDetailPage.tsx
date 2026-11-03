import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useBoard } from '../gen/hooks/useBoard'
import BoardModel from '../gen/models/board'
import { errorMessage } from '../api/errors'
import { formatDateTime, imageUrl } from '../lib/format'
import { ConfirmModal } from '../components/ConfirmModal'
import { ImageLightbox } from '../components/ImageLightbox'
import { useFeedback } from '../context/feedback'

export function BoardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)
  const navigate = useNavigate()
  const notify = useFeedback()
  // 읽기는 생성 훅, 삭제처럼 결과를 바로 알아야 하는 쓰기는 생성 모델(던지는 쪽)을 쓴다.
  const { item: board, loading, error, fetchOne } = useBoard()
  const [loadedId, setLoadedId] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let alive = true
    void fetchOne(boardId).then(() => {
      if (alive) setLoadedId(boardId)
    })
    return () => {
      alive = false
    }
  }, [fetchOne, boardId])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await BoardModel.remove(boardId)
      setConfirmOpen(false)
      notify({ type: 'success', message: '게시글이 삭제되었습니다.' })
      navigate('/')
    } catch (e) {
      setDeleting(false)
      setConfirmOpen(false)
      notify({
        type: 'error',
        message: errorMessage(e, '삭제에 실패했습니다.'),
      })
    }
  }

  if (loading || loadedId !== boardId)
    return <p className="muted page">불러오는 중…</p>
  if (error != null)
    return (
      <p className="error page">
        {errorMessage(error, '게시글을 불러오지 못했습니다.')}
      </p>
    )
  if (!board) return <p className="muted page">게시글이 없습니다.</p>

  const img = imageUrl(board.img)

  return (
    <section className="page board-detail">
      <h1>{board.title || '(제목 없음)'}</h1>
      <div className="board-meta">
        <span>작성자 {board.extra?.user?.name || `#${board.user}`}</span>
        <span>{formatDateTime(board.createddate)}</span>
      </div>

      {img && (
        <ImageLightbox
          className="board-image"
          src={img}
          alt={board.title || '게시글 이미지'}
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
