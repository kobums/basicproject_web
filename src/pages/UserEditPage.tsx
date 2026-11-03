import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'
import { useUser } from '../gen/hooks/useUser'
import UserModel from '../gen/models/user'
import type { UpdateUserRequest } from '../gen/types/user'
import { errorMessage, fieldErrorsOf } from '../api/errors'
import { useFeedback } from '../context/feedback'

export function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const navigate = useNavigate()
  const notify = useFeedback()
  const { item: user, loading, error, fetchOne } = useUser()
  const [loadedId, setLoadedId] = useState<number | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let alive = true
    void fetchOne(userId).then(() => {
      if (alive) setLoadedId(userId)
    })
    return () => {
      alive = false
    }
  }, [fetchOne, userId])

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      // 이메일은 바꾸지 않는다. 비밀번호(passwd)는 입력했을 때만 보낸다 (안 보낸 필드는 서버가 유지).
      const body: UpdateUserRequest = { name: values.name }
      if (values.password) body.passwd = values.password
      await UserModel.update(userId, body)
      notify({ type: 'success', message: '회원 정보가 수정되었습니다.' })
      navigate('/users')
    } catch (e) {
      setFieldErrors(fieldErrorsOf(e))
      notify({
        type: 'error',
        message: errorMessage(e, '수정에 실패했습니다.'),
      })
      setSubmitting(false)
    }
  }

  if (loading || loadedId !== userId)
    return <p className="muted page">불러오는 중…</p>
  if (error != null)
    return (
      <p className="error page">
        {errorMessage(error, '회원 정보를 불러오지 못했습니다.')}
      </p>
    )
  if (!user) return <p className="muted page">회원이 없습니다.</p>

  return (
    <section className="page">
      <h1>회원 수정</h1>
      <UserForm
        mode="edit"
        initialEmail={user.email}
        initialName={user.name}
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/users')}
      />
    </section>
  )
}
