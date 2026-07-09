import { Link, useNavigate } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { Pagination } from '../components/Pagination'
import { PageHeader } from '../components/PageHeader'
import { ListToolbar } from '../components/ListToolbar'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { formatDateTime } from '../lib/format'
import type { User } from '../types/user'

const COLUMNS: DataTableColumn<User>[] = [
  { key: 'id', header: '번호', width: '64px', align: 'center' },
  { key: 'email', header: '이메일' },
  {
    key: 'name',
    header: '이름',
    width: '110px',
    render: (user) => user.name ?? '-',
  },
  {
    key: 'createdAt',
    header: '가입일',
    width: '140px',
    render: (user) => (
      <span className="muted">{formatDateTime(user.createdAt)}</span>
    ),
  },
]

export function UserListPage() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    size,
    changeSize,
    keyword,
    setKeyword,
  } = useUsers()
  const navigate = useNavigate()
  const isSearching = keyword.trim().length > 0

  return (
    <section className="page">
      <PageHeader title="회원">
        <Link className="btn btn-primary" to="/users/new">
          회원 추가
        </Link>
      </PageHeader>

      <search className="search-bar">
        <input
          className="search-input"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          aria-label="회원 검색"
        />
      </search>

      {loading && !data && <p className="muted">불러오는 중…</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <ListToolbar
            info={
              isSearching
                ? `‘${keyword.trim()}’ 검색 결과 ${data.totalElements}명`
                : `전체 ${data.totalElements}명`
            }
            size={size}
            onSizeChange={changeSize}
          />

          <DataTable
            columns={COLUMNS}
            data={data.content}
            rowKey={(user) => user.id}
            onRowClick={(user) => navigate(`/users/${user.id}`)}
            emptyText={
              isSearching ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'
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
