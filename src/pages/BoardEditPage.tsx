import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardForm } from '../components/BoardForm'
import type { BoardFormValues } from '../components/BoardForm'
import { useBoard } from '../gen/hooks/useBoard'
import BoardModel from '../gen/models/board'
import type { UpdateBoardRequest } from '../gen/types/board'
import { uploadImage } from '../api/upload'
import { errorMessage, fieldErrorsOf } from '../api/errors'
import { imageUrl } from '../lib/format'
import { useFeedback } from '../context/feedback'
import { useAuth } from '../context/auth'
import { isBoardOwner } from '../lib/permissions'

export function BoardEditPage() {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)
  const navigate = useNavigate()
  const notify = useFeedback()
  const { user } = useAuth()
  const { item: board, loading, error, fetchOne } = useBoard()
  const [loadedId, setLoadedId] = useState<number | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let alive = true
    void fetchOne(boardId).then(() => {
      if (alive) setLoadedId(boardId)
    })
    return () => {
      alive = false
    }
  }, [fetchOne, boardId])

  const handleSubmit = async (values: BoardFormValues) => {
    if (!values.title.trim()) {
      setFieldErrors({ title: '제목을 입력하세요.' })
      return
    }
    setSubmitting(true)
    setFieldErrors({})
    try {
      // 보낸 필드만 바뀐다 (두 백엔드 모두 부분 수정). 이미지는 새로 고른 경우에만 교체.
      const body: UpdateBoardRequest = {
        title: values.title,
        content: values.content,
      }
      if (values.image) body.img = await uploadImage(values.image)
      await BoardModel.update(boardId, body)
      notify({ type: 'success', message: '게시글이 수정되었습니다.' })
      navigate(`/boards/${boardId}`)
    } catch (e) {
      const fields = fieldErrorsOf(e)
      setFieldErrors(fields)
      notify({
        type: 'error',
        message:
          Object.keys(fields).length > 0
            ? '입력값을 확인해주세요.'
            : errorMessage(e, '수정에 실패했습니다.'),
      })
      setSubmitting(false)
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
  // 남의 글은 읽을 수만 있다 (서버도 수정을 막는다).
  if (!isBoardOwner(user, board))
    return <p className="error page">작성자만 수정할 수 있습니다.</p>

  return (
    <section className="page">
      <h1>글 수정</h1>
      <BoardForm
        mode="edit"
        initialTitle={board.title}
        initialContent={board.content ?? ''}
        currentImgUrl={imageUrl(board.img)}
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/boards/${boardId}`)}
      />
    </section>
  )
}
