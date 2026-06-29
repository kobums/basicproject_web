import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BoardForm } from '../components/BoardForm'
import type { BoardFormValues } from '../components/BoardForm'
import { createBoard } from '../api/boards'
import { HttpError } from '../api/client'
import { useFeedback } from '../context/feedback'

export function BoardWritePage() {
  const navigate = useNavigate()
  const notify = useFeedback()
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (values: BoardFormValues) => {
    // 작성자는 로그인 사용자(JWT)에서, 이미지는 선택값. 내용만 필수 확인.
    if (!values.content.trim()) {
      setFieldErrors({ content: '내용을 입력하세요.' })
      return
    }

    setSubmitting(true)
    setFieldErrors({})
    try {
      const created = await createBoard({
        title: values.title,
        content: values.content,
        image: values.image,
      })
      notify({ type: 'success', message: '게시글이 등록되었습니다.' })
      navigate(`/boards/${created.id}`)
    } catch (e) {
      if (e instanceof HttpError && e.status === 400) {
        setFieldErrors(e.fieldErrors)
        notify({ type: 'error', message: '입력값을 확인해주세요.' })
      } else {
        notify({
          type: 'error',
          message: e instanceof Error ? e.message : '등록에 실패했습니다.',
        })
      }
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <h1>글쓰기</h1>
      <BoardForm
        mode="create"
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </section>
  )
}
