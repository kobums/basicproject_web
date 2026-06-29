import { api } from './client'
import type {
  PageResponse,
  User,
  UserCreateRequest,
  UserUpdateRequest,
} from '../types/user'

// keyword 가 있으면 이름/이메일 검색, 없으면 전체 목록.
export const fetchUsers = (page = 0, keyword = '', size = 10) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'id,desc',
  })
  const kw = keyword.trim()
  if (kw) params.set('keyword', kw)
  return api.get<PageResponse<User>>(`/users?${params.toString()}`)
}

// 게시글 작성 폼의 작성자 선택용 — 충분히 큰 size 로 한 번에 조회
export const fetchAllUsers = () =>
  api.get<PageResponse<User>>(`/users?page=0&size=200&sort=id,asc`)

export const fetchUser = (id: number) => api.get<User>(`/users/${id}`)

export const createUser = (body: UserCreateRequest) =>
  api.post<User>('/users', body)

export const updateUser = (id: number, body: UserUpdateRequest) =>
  api.put<User>(`/users/${id}`, body)

export const deleteUser = (id: number) => api.del(`/users/${id}`)
