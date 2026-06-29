import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'
import { signup } from '../api/auth'
import { HttpError } from '../api/client'
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
