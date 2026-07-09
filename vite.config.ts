import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // dev에서 /api, /uploads 요청을 Spring Boot(8081)로 프록시 → same-origin, CORS preflight 회피
    proxy: {
      '/api': 'http://localhost:8081',
      '/uploads': 'http://localhost:8081',
    },
  },
})
