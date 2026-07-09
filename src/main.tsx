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
