import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserForm } from '../components/UserForm'
import type { UserFormValues } from '../components/UserForm'
import { useUser } from '../hooks/useUser'
import { updateUser } from '../api/users'
import { HttpError } from '../api/client'

export function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)
  const navigate = useNavigate()
  const { user, loading, error } = useUser(userId)

  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      // 이메일은 변경하지 않음. 비밀번호는 비우면 기존 값 유지.
      await updateUser(userId, { name: values.name, password: values.password })
      navigate('/users')
    } catch (e) {
      if (e instanceof HttpError && e.status === 400) {
        setFieldErrors(e.fieldErrors)
      } else {
        alert(e instanceof Error ? e.message : '수정에 실패했습니다.')
      }
      setSubmitting(false)
    }
  }

  if (loading) return <p className="muted page">불러오는 중…</p>
  if (error) return <p className="error page">{error}</p>
  if (!user) return null

  return (
    <section className="page">
      <h1>회원 수정</h1>
      <UserForm
        mode="edit"
        initialEmail={user.email}
        initialName={user.name ?? ''}
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/users')}
      />
    </section>
  )
}
