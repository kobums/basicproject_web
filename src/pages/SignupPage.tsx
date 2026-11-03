import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'
import { signup } from '../api/auth'
import { errorMessage, fieldErrorsOf } from '../api/errors'
import { useAuth } from '../context/auth'
import { useFeedback } from '../context/feedback'

export function SignupPage() {
  const navigate = useNavigate()
  const notify = useFeedback()
  const { setSession } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      const res = await signup(values)
      // 가입 즉시 로그인 상태로 전환하고 홈으로 이동
      setSession(res.token, res.user)
      notify({ type: 'success', message: '가입이 완료되었습니다.' })
      navigate('/', { replace: true })
    } catch (e) {
      const fields = fieldErrorsOf(e)
      setFieldErrors(fields)
      notify({
        type: 'error',
        message:
          Object.keys(fields).length > 0
            ? '입력값을 확인해주세요.'
            : errorMessage(e, '가입에 실패했습니다.'),
      })
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <h1>회원가입</h1>
      <UserForm
        mode="create"
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/login')}
      />
    </section>
  )
}
