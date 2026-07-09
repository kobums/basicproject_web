import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { BoardListPage } from './pages/BoardListPage'
import { BoardDetailPage } from './pages/BoardDetailPage'
import { BoardWritePage } from './pages/BoardWritePage'
import { BoardEditPage } from './pages/BoardEditPage'
import { UserListPage } from './pages/UserListPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { UserWritePage } from './pages/UserWritePage'
import { UserEditPage } from './pages/UserEditPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ComponentsPage } from './pages/ComponentsPage'
import { RequireAuth } from './components/RequireAuth'
import { useAuth } from './context/auth'

function App() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <nav className="topnav">
        <span className="brand">basicproject</span>
        <div className="topnav-links">
          <NavLink to="/" end>
            게시판
          </NavLink>
          <NavLink to="/users">회원</NavLink>
          <NavLink to="/components">컴포넌트</NavLink>
        </div>
        <div className="topnav-auth">
          {isAuthenticated ? (
            <>
              <span className="topnav-user">{user?.name ?? user?.email}</span>
              <button
                type="button"
                className="btn btn-sm"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<BoardListPage />} />
          <Route
            path="/boards/new"
            element={
              <RequireAuth>
                <BoardWritePage />
              </RequireAuth>
            }
          />
          <Route path="/boards/:id" element={<BoardDetailPage />} />
          <Route
            path="/boards/:id/edit"
            element={
              <RequireAuth>
                <BoardEditPage />
              </RequireAuth>
            }
          />
          <Route path="/users" element={<UserListPage />} />
          <Route
            path="/users/new"
            element={
              <RequireAuth>
                <UserWritePage />
              </RequireAuth>
            }
          />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route
            path="/users/:id/edit"
            element={
              <RequireAuth>
                <UserEditPage />
              </RequireAuth>
            }
          />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="*"
            element={<p className="page muted">페이지를 찾을 수 없습니다.</p>}
          />
        </Routes>
      </main>
    </>
  )
}

export default App
