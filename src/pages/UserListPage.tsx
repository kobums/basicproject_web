import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../gen/hooks/useUser'
import type { User, UserSearchParams } from '../gen/types/user'
import { errorMessage } from '../api/errors'
import { Pagination } from '../components/Pagination'
import { PageHeader } from '../components/PageHeader'
import { ListToolbar } from '../components/ListToolbar'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { formatDateTime, pageCount } from '../lib/format'

const COLUMNS: DataTableColumn<User>[] = [
  { key: 'id', header: '번호', width: '64px', align: 'center' },
  { key: 'email', header: '이메일' },
  {
    key: 'name',
    header: '이름',
    width: '110px',
    render: (user) => user.name || '-',
  },
  {
    key: 'createddate',
    header: '가입일',
    width: '140px',
    render: (user) => (
      <span className="muted">{formatDateTime(user.createddate)}</span>
    ),
  },
]

// 검색어 → 목록 필터. gomachine 문자열 필터는 같음(=) 비교라 '@' 가 있으면 이메일, 아니면 이름과 정확히 같은 회원을 찾는다.
function toFilter(keyword: string): UserSearchParams {
  if (!keyword) return {}
  return keyword.includes('@') ? { email: keyword } : { name: keyword }
}

export function UserListPage() {
  const { items, total, loading, error, fetchPage } = useUser()
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  // keyword: 입력값(즉시 반영), applied: 실제 조회에 쓰이는 값
  const [keyword, setKeyword] = useState('')
  const [applied, setApplied] = useState('')
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()

  // 입력이 멈춘 뒤 300ms 후에만 조회어를 갱신(타이핑마다 요청 폭주 방지).
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplied(keyword.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    void fetchPage({
      page,
      pagesize: size,
      orderby: 'id desc',
      ...toFilter(applied),
    }).then(() => setLoaded(true))
  }, [fetchPage, page, size, applied])

  const changeSize = (next: number) => {
    setSize(next)
    setPage(1)
  }

  const isSearching = applied.length > 0

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
          placeholder="이름 또는 이메일 (정확히 일치)"
          aria-label="회원 검색"
        />
      </search>

      {loading && !loaded && <p className="muted">불러오는 중…</p>}
      {error != null && (
        <p className="error">
          {errorMessage(error, '회원 목록을 불러오지 못했습니다.')}
        </p>
      )}

      {loaded && error == null && (
        <>
          <ListToolbar
            info={
              isSearching
                ? `‘${applied}’ 검색 결과 ${total}명`
                : `전체 ${total}명`
            }
            size={size}
            onSizeChange={changeSize}
          />

          <DataTable
            columns={COLUMNS}
            data={items}
            rowKey={(user) => user.id}
            onRowClick={(user) => navigate(`/users/${user.id}`)}
            emptyText={
              isSearching ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'
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
