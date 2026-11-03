/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env / .env.local / 셸 환경변수에서 읽는다 (vite.config 에서만 쓰므로 번들에 들어가지 않는다).
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  // 백엔드 주소: Go 8007 (기본) / Spring 8081 / Rust 8008
  const target = env.VITE_PROXY_TARGET || 'http://localhost:8007'

  return {
    plugins: [react()],
    server: {
      // dev 에서 /api, /uploads 요청을 백엔드로 프록시 → same-origin, CORS preflight 회피
      proxy: {
        '/api': { target, changeOrigin: true },
        '/uploads': { target, changeOrigin: true },
      },
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['src/test/setup.ts'],
    },
  }
})
