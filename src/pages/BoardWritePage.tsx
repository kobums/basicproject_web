import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BoardForm } from '../components/BoardForm'
import type { BoardFormValues } from '../components/BoardForm'
import BoardModel from '../gen/models/board'
import { uploadImage } from '../api/upload'
import { errorMessage, fieldErrorsOf } from '../api/errors'
import { useFeedback } from '../context/feedback'

export function BoardWritePage() {
  const navigate = useNavigate()
  const notify = useFeedback()
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (values: BoardFormValues) => {
    if (!values.title.trim()) {
      setFieldErrors({ title: '제목을 입력하세요.' })
      return
    }

    setSubmitting(true)
    setFieldErrors({})
    try {
      // 이미지는 먼저 올리고 받은 경로를 img 에 넣는다.
      // 작성자(user)는 보내지 않는다: 서버가 로그인 사용자(session)로 채운다.
      const img = values.image ? await uploadImage(values.image) : null
      const created = await BoardModel.insert({
        title: values.title,
        content: values.content,
        img,
      })
      notify({ type: 'success', message: '게시글이 등록되었습니다.' })
      // Go / Rust 는 {id}, Spring 은 저장한 엔티티를 돌려준다 (둘 다 id 가 있다).
      navigate(created.id ? `/boards/${created.id}` : '/')
    } catch (e) {
      const fields = fieldErrorsOf(e)
      setFieldErrors(fields)
      notify({
        type: 'error',
        message:
          Object.keys(fields).length > 0
            ? '입력값을 확인해주세요.'
            : errorMessage(e, '등록에 실패했습니다.'),
      })
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
