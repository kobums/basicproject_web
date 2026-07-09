interface EmptyProps {
  text?: string
}

// 목록/검색 결과가 비었을 때 보여주는 빈 상태 표시
export function Empty({ text = '데이터가 없습니다.' }: Readonly<EmptyProps>) {
  return (
    <div className="empty">
      <svg
        viewBox="0 0 24 24"
        width="44"
        height="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
      <p>{text}</p>
    </div>
  )
}
