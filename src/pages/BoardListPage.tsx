import { Link, useNavigate } from 'react-router-dom'
import { useBoards } from '../hooks/useBoards'
import { Pagination } from '../components/Pagination'
import { SearchBar } from '../components/SearchBar'
import { PageHeader } from '../components/PageHeader'
import { ListToolbar } from '../components/ListToolbar'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { formatDateTime } from '../lib/format'
import type { Board } from '../types/board'

// 첨부 이미지가 있는 글의 제목 옆에 붙이는 작은 아이콘
function ImageIcon() {
  return (
    <svg
      className="title-img-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="이미지 첨부"
      role="img"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}

const COLUMNS: DataTableColumn<Board>[] = [
  { key: 'id', header: '번호', width: '64px', align: 'center' },
  {
    key: 'title',
    header: '제목',
    render: (board) => (
      <>
        <span className="title-text">{board.title ?? '(제목 없음)'}</span>
        {board.imgUrl && <ImageIcon />}
      </>
    ),
  },
  {
    key: 'author',
    header: '작성자',
    width: '110px',
    render: (board) => board.author.name ?? `#${board.author.id}`,
  },
  {
    key: 'createdAt',
    header: '작성일',
    width: '140px',
    render: (board) => (
      <span className="muted">{formatDateTime(board.createdAt)}</span>
    ),
  },
]

export function BoardListPage() {
  const { data, loading, error, page, setPage, size, changeSize, search, submitSearch } =
    useBoards()
  const navigate = useNavigate()

  const isSearching = search.keyword.trim().length > 0

  return (
    <section className="page">
      <PageHeader title="게시판">
        <Link className="btn btn-primary" to="/boards/new">
          글쓰기
        </Link>
      </PageHeader>

      <SearchBar value={search} onSearch={submitSearch} />

      {loading && <p className="muted">불러오는 중…</p>}
      {error && <p className="error">{error}</p>}

      {data && !loading && (
        <>
          <ListToolbar
            info={
              isSearching
                ? `‘${search.keyword.trim()}’ 검색 결과 ${data.totalElements}건`
                : `전체 ${data.totalElements}건`
            }
            size={size}
            onSizeChange={changeSize}
          />

          <DataTable
            columns={COLUMNS}
            data={data.content}
            rowKey={(board) => board.id}
            onRowClick={(board) => navigate(`/boards/${board.id}`)}
            emptyText={
              isSearching ? '검색 결과가 없습니다.' : '등록된 글이 없습니다.'
            }
          />

          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </section>
  )
}
