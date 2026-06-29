// 백엔드 BoardResponse 와 대응 (board_tb + 작성자 조인)
export interface Author {
  id: number
  name: string | null
}

export interface Board {
  id: number
  title: string | null
  content: string
  imgUrl: string | null
  author: Author
  createdAt: string
}

// 검색 조건: 제목 | 내용 | 제목+내용 | 작성자
export type SearchType = 'title' | 'content' | 'all' | 'author'

export interface BoardSearch {
  type: SearchType
  keyword: string
}

export type { PageResponse } from './page'
