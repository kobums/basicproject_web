// 백엔드 날짜 → "2026-06-28 13:46"
//   gomachine 계약: "yyyy-MM-dd HH:mm:ss" (서버 시간 그대로) → 앞 16자리만 쓴다.
//   시간대가 붙은 ISO (예: "2026-06-28T04:46:22Z") 는 브라우저 지역 시간으로 바꾼다.
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  const local = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(:\d{2}(\.\d+)?)?$/.exec(
    value,
  )
  if (local) return `${local[1]} ${local[2]}`
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const UPLOAD_BASE = (
  import.meta.env.VITE_UPLOAD_BASE_URL || '/uploads'
).replace(/\/$/, '')

// 게시글 img 값(업로드 응답의 filename) → 화면에 쓸 주소. 이미 절대 주소나 / 로 시작하면 그대로 쓴다.
export function imageUrl(img: string | null | undefined): string | null {
  if (!img) return null
  if (
    /^(https?:)?\/\//.test(img) ||
    img.startsWith('/') ||
    img.startsWith('data:')
  )
    return img
  return `${UPLOAD_BASE}/${img}`
}

// 전체 개수와 페이지 크기 → 전체 페이지 수 (최소 1)
export function pageCount(total: number, pagesize: number): number {
  return Math.max(1, Math.ceil(total / Math.max(1, pagesize)))
}
