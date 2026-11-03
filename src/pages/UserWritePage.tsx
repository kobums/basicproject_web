import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'
import UserModel from '../gen/models/user'
import { errorMessage, fieldErrorsOf } from '../api/errors'
import { useFeedback } from '../context/feedback'

export function UserWritePage() {
  const navigate = useNavigate()
  const notify = useFeedback()
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      // 생성 API 의 비밀번호 필드는 passwd (서버가 해시해서 저장한다). level 은 보호 컬럼이라 보내지 않는다.
      await UserModel.insert({
        email: values.email,
        name: values.name,
        passwd: values.password,
      })
      notify({ type: 'success', message: '회원이 등록되었습니다.' })
      navigate('/users')
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
      <h1>회원 추가</h1>
      <UserForm
        mode="create"
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/users')}
      />
    </section>
  )
}
