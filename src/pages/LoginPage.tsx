import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { HttpError } from '../api/client'
import { Input } from '../components/Input'
import { useAuth } from '../context/auth'
import { useFeedback } from '../context/feedback'

interface LocationState {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const notify = useFeedback()
  const { setSession } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 로그인 후 원래 가려던 페이지로 복귀 (없으면 홈)
  const from = (location.state as LocationState | null)?.from ?? '/'

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await login({ email, password })
      setSession(res.token, res.user)
      navigate(from, { replace: true })
    } catch (err) {
      notify({
        type: 'error',
        message:
          err instanceof HttpError
            ? err.message
            : '로그인에 실패했습니다.',
      })
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <h1>로그인</h1>
      <form className="board-form" onSubmit={handleSubmit}>
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="user@example.com"
          required
        />

        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="비밀번호"
          required
        />

        <div className="board-form-actions">
          <Link className="btn" to="/signup">
            회원가입
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? '로그인 중…' : '로그인'}
          </button>
        </div>
      </form>
    </section>
  )
}
