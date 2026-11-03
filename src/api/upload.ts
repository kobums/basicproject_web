// 이미지 업로드 (손으로 만든 부분). 게시글은 JSON 으로 저장하고 이미지는 먼저 올려서 받은 경로를 img 에 넣는다.
//
// 기본 계약 (basicproject_go): POST /api/upload/index, multipart 필드 "upload" (로그인 필요)
//   → { code: "ok", filename: "20260101/20260101120000_xxx.png", original: "a.png" }
// 다른 백엔드가 { url } / { path } / { item: { filename } } 을 주어도 받는다.
import { post } from './client'
import { ApiError, checkGoError } from '../gen/models/contract'

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('upload', file)
  const res = await post<unknown>('/upload/index', form)
  checkGoError(res.data)
  const body = res.data as Record<string, unknown> | undefined
  const inner = body?.item as Record<string, unknown> | undefined
  const path = [body?.filename, body?.url, body?.path, inner?.filename].find(
    (v): v is string => typeof v === 'string' && v !== '',
  )
  if (!path) throw new ApiError('error', '업로드 응답에 파일 경로가 없습니다.')
  return path
}
