import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'
import UserModel from '../gen/models/user'
import type { CreateUserRequest } from '../gen/types/user'
import { useAuth } from '../context/auth'
import { isAdmin } from '../lib/permissions'
import { errorMessage, fieldErrorsOf } from '../api/errors'
import { useFeedback } from '../context/feedback'

export function UserWritePage() {
  const navigate = useNavigate()
  const notify = useFeedback()
  const { user: me } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      // 생성 API 의 비밀번호 필드는 passwd (서버가 해시해서 저장한다).
      // level(보호 컬럼) / createddate 는 서버가 정하므로 CreateUserRequest 에 없다.
      const body: CreateUserRequest = {
        email: values.email,
        name: values.name,
        passwd: values.password,
      }
      await UserModel.insert(body)
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

  // 회원 추가는 관리자 화면이다 (일반 가입은 /signup).
  if (!isAdmin(me))
    return <p className="error page">관리자만 회원을 추가할 수 있습니다.</p>

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
