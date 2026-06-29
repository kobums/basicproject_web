import { api } from './client'
import type { Board, BoardSearch, PageResponse } from '../types/board'

// 검색어가 있으면 type/keyword 를 함께 전달, 없으면 전체 목록.
export const fetchBoards = (page = 0, search?: BoardSearch, size = 10) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'id,desc',
  })
  const keyword = search?.keyword.trim()
  if (keyword) {
    params.set('type', search!.type)
    params.set('keyword', keyword)
  }
  return api.get<PageResponse<Board>>(`/boards?${params.toString()}`)
}

export const fetchBoard = (id: number) => api.get<Board>(`/boards/${id}`)

// 작성 입력 → multipart FormData 로 변환.
// 작성자는 보내지 않는다(서버가 JWT에서 가져옴). 이미지는 선택값.
export interface BoardCreateInput {
  title: string
  content: string
  image?: File | null
}

export function createBoard(input: BoardCreateInput) {
  const form = new FormData()
  form.append('title', input.title)
  form.append('content', input.content)
  if (input.image) form.append('image', input.image)
  return api.post<Board>('/boards', form)
}

// 수정 입력 (이미지는 선택)
export interface BoardUpdateInput {
  title: string
  content: string
  image?: File | null
}

export function updateBoard(id: number, input: BoardUpdateInput) {
  const form = new FormData()
  form.append('title', input.title)
  form.append('content', input.content)
  if (input.image) form.append('image', input.image)
  return api.put<Board>(`/boards/${id}`, form)
}

export const deleteBoard = (id: number) => api.del(`/boards/${id}`)
