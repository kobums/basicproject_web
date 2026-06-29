// 백엔드 PageResponse<T> 와 대응 (목록 페이징 공용 타입)
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}
