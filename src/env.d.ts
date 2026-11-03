/// <reference types="vite/client" />

// .env / .env.local 에서 읽는 값 (VITE_* 는 번들에 그대로 들어가므로 시크릿 금지)
interface ImportMetaEnv {
  /** API 주소 앞부분. 기본 '/api' (dev 에서는 Vite 프록시가 백엔드로 넘긴다) */
  readonly VITE_API_BASE_URL?: string
  /** 업로드 이미지 주소 앞부분. 기본 '/uploads' */
  readonly VITE_UPLOAD_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
