import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  children?: ReactNode // 우측 액션 영역 (버튼/링크)
}

// 목록 페이지 상단의 "제목 + 우측 액션 버튼" 헤더.
export function PageHeader({ title, children }: Readonly<PageHeaderProps>) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {children}
    </header>
  )
}
