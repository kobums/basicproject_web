import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './board.css'
import './components.css'
import App from './App.tsx'
import { FeedbackProvider } from './components/FeedbackProvider'
import { AuthProvider } from './components/AuthProvider'
import { LoadingProvider } from './components/LoadingProvider'
import { setupApi } from './api/setup'

// 토큰 / 401 처리를 HTTP 클라이언트에 등록 (생성 모델과 손으로 만든 api 가 함께 쓴다)
setupApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FeedbackProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </FeedbackProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
