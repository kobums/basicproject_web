import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBoard } from '../gen/hooks/useBoard'
import type { Board } from '../gen/types/board'
import { errorMessage } from '../api/errors'
import { Pagination } from '../components/Pagination'
import { SearchBar } from '../components/SearchBar'
import type { BoardSearch } from '../components/SearchBar'
import { PageHeader } from '../components/PageHeader'
import { ListToolbar } from '../components/ListToolbar'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { formatDateTime, pageCount } from '../lib/format'

const EMPTY_SEARCH: BoardSearch = { type: 'title', keyword: '' }

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
        <span className="title-text">{board.title || '(제목 없음)'}</span>
        {board.img && <ImageIcon />}
      </>
    ),
  },
  {
    key: 'user',
    header: '작성자',
    width: '110px',
    // board.user 는 작성자 id, 조인한 작성자 정보는 extra.user (model.json 의 join)
    render: (board) => board.extra?.user?.name || `#${board.user}`,
  },
  {
    key: 'createddate',
    header: '작성일',
    width: '140px',
    render: (board) => (
      <span className="muted">{formatDateTime(board.createddate)}</span>
    ),
  },
]

export function BoardListPage() {
  // 목록 상태는 생성 훅(useBoard)이 갖고, 페이지(1 부터) / 크기 / 검색 조건만 여기서 관리한다.
  // board 는 read: "login" 이라 로그인 사용자는 모든 사람의 글을 본다 (수정 / 삭제는 상세 화면에서 작성자만).
  const { items, total, loading, error, fetchPage } = useBoard()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState<BoardSearch>(EMPTY_SEARCH)
  const navigate = useNavigate()

  const keyword = search.keyword.trim()
  const isSearching = keyword.length > 0

  useEffect(() => {
    void fetchPage({
      page,
      pagesize: size,
      orderby: 'id desc',
      ...(keyword ? { [search.type]: keyword } : {}),
    })
  }, [fetchPage, page, size, search.type, keyword])

  // 검색 / 페이지 크기 변경은 첫 페이지부터 다시 조회
  const submitSearch = (next: BoardSearch) => {
    setSearch(next)
    setPage(1)
  }
  const changeSize = (next: number) => {
    setSize(next)
    setPage(1)
  }

  return (
    <section className="page">
      <PageHeader title="게시판">
        <Link className="btn btn-primary" to="/boards/new">
          글쓰기
        </Link>
      </PageHeader>

      <SearchBar value={search} onSearch={submitSearch} />

      {loading && <p className="muted">불러오는 중…</p>}
      {error != null && (
        <p className="error">
          {errorMessage(error, '목록을 불러오지 못했습니다.')}
        </p>
      )}

      {!loading && error == null && (
        <>
          <ListToolbar
            info={
              isSearching
                ? `‘${keyword}’ 검색 결과 ${total}건`
                : `전체 ${total}건`
            }
            size={size}
            onSizeChange={changeSize}
          />

          <DataTable
            columns={COLUMNS}
            data={items}
            rowKey={(board) => board.id}
            onRowClick={(board) => navigate(`/boards/${board.id}`)}
            emptyText={
              isSearching ? '검색 결과가 없습니다.' : '등록된 글이 없습니다.'
            }
          />

          <Pagination
            page={page}
            totalPages={pageCount(total, size)}
            onChange={setPage}
          />
        </>
      )}
    </section>
  )
}
