import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardForm } from '../components/BoardForm'
import type { BoardFormValues } from '../components/BoardForm'
import { useBoard } from '../hooks/useBoard'
import { updateBoard } from '../api/boards'
import { HttpError } from '../api/client'
import { useFeedback } from '../context/feedback'

export function BoardEditPage() {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)
  const navigate = useNavigate()
  const notify = useFeedback()
  const { board, loading, error } = useBoard(boardId)

  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (values: BoardFormValues) => {
    if (!values.content.trim()) {
      setFieldErrors({ content: '내용을 입력하세요.' })
      return
    }
    setSubmitting(true)
    setFieldErrors({})
    try {
      // 이미지는 새로 선택한 경우에만 교체 (없으면 기존 이미지 유지)
      await updateBoard(boardId, {
        title: values.title,
        content: values.content,
        image: values.image,
      })
      notify({ type: 'success', message: '게시글이 수정되었습니다.' })
      navigate(`/boards/${boardId}`)
    } catch (e) {
      if (e instanceof HttpError && e.status === 400) {
        setFieldErrors(e.fieldErrors)
        notify({ type: 'error', message: '입력값을 확인해주세요.' })
      } else {
        notify({
          type: 'error',
          message: e instanceof Error ? e.message : '수정에 실패했습니다.',
        })
      }
      setSubmitting(false)
    }
  }

  if (loading) return <p className="muted page">불러오는 중…</p>
  if (error) return <p className="error page">{error}</p>
  if (!board) return null

  return (
    <section className="page">
      <h1>글 수정</h1>
      <BoardForm
        mode="edit"
        initialTitle={board.title ?? ''}
        initialContent={board.content}
        currentImgUrl={board.imgUrl}
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/boards/${boardId}`)}
      />
    </section>
  )
}
