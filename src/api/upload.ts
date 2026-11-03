// 이미지 업로드 (손으로 만든 부분). 게시글은 JSON 으로 저장하고 이미지는 먼저 올려서 받은 주소를 img 에 넣는다.
//
// 계약 (Go / Spring / Rust 템플릿 공통): POST /api/upload/index, multipart 필드 "upload" (로그인 필요)
//   → 200 {filename: "20260101/20260101120000_xxx.png", url: "/uploads/20260101/20260101120000_xxx.png"}
// url 이 있으면 그대로 쓰고 (화면에서 바로 열 수 있는 주소), 없으면 filename 을 쓴다 (VITE_UPLOAD_BASE_URL 을 앞에 붙여 보여준다).
import { post } from './client'
import { ApiError, checkGoError } from '../gen/models/contract'

export interface UploadResponse {
  filename: string
  url?: string
}

/** 이미지를 올리고 게시글 img 에 넣을 값(url, 없으면 filename)을 돌려준다. */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('upload', file)
  const res = await post<unknown>('/upload/index', form)
  // 예전 Go 업로드는 HTTP 200 + {code: "error"} 로 실패를 알렸다.
  checkGoError(res.data)
  const body = (res.data ?? {}) as Partial<UploadResponse>
  const path = [body.url, body.filename].find(
    (v): v is string => typeof v === 'string' && v !== '',
  )
  if (!path) throw new ApiError('error', '업로드 응답에 파일 주소가 없습니다.')
  return path
}
