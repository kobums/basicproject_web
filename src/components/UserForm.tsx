import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Input } from './Input'

export interface UserFormValues {
  email: string
  name: string
  password: string
}

interface UserFormProps {
  mode: 'create' | 'edit'
  initialEmail?: string
  initialName?: string
  submitting: boolean
  fieldErrors?: Record<string, string>
  onSubmit: (values: UserFormValues) => void
  onCancel: () => void
}

export function UserForm({
  mode,
  initialEmail = '',
  initialName = '',
  submitting,
  fieldErrors = {},
  onSubmit,
  onCancel,
}: Readonly<UserFormProps>) {
  const [email, setEmail] = useState(initialEmail)
  const [name, setName] = useState(initialName)
  const [password, setPassword] = useState('')

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit({ email, name, password })
  }

  // 중첩 삼항을 피하려 제출 버튼 라벨을 미리 계산
  const actionLabel = mode === 'create' ? '가입' : '수정'

  return (
    <form className="board-form" onSubmit={handleSubmit}>
      {/* 이메일은 가입 시에만 입력 (수정 화면에서는 변경하지 않음) */}
      <Input
        label="이메일"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="user@example.com"
        disabled={mode === 'edit'}
        error={fieldErrors.email}
      />

      <Input
        label="이름"
        value={name}
        onChange={setName}
        placeholder="이름"
        error={fieldErrors.name}
      />

      <Input
        label={`비밀번호${mode === 'edit' ? ' (변경 시에만 입력)' : ''}`}
        type="password"
        value={password}
        onChange={setPassword}
        placeholder={
          mode === 'edit' ? '비워두면 기존 비밀번호 유지' : '비밀번호'
        }
        error={fieldErrors.password}
      />

      <div className="board-form-actions">
        <button
          type="button"
          className="btn"
          onClick={onCancel}
          disabled={submitting}
        >
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '저장 중…' : actionLabel}
        </button>
      </div>
    </form>
  )
}
