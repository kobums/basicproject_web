import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'
import { createUser } from '../api/users'
import { HttpError } from '../api/client'
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
      await createUser(values)
      notify({ type: 'success', message: '회원이 등록되었습니다.' })
      navigate('/users')
    } catch (e) {
      if (e instanceof HttpError && e.status === 400) {
        setFieldErrors(e.fieldErrors)
        const hasField = Object.keys(e.fieldErrors).length > 0
        notify({
          type: 'error',
          message: hasField ? '입력값을 확인해주세요.' : e.message,
        })
      } else {
        notify({
          type: 'error',
          message: e instanceof Error ? e.message : '가입에 실패했습니다.',
        })
      }
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
