import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { SearchInput } from './SearchInput'
import { DataTable } from './DataTable'
import type { DataTableColumn } from './DataTable'
import { Pagination } from './Pagination'
import type { Page } from '../gen/models/contract'
import { pageCount } from '../lib/format'
import { errorMessage } from '../api/errors'

interface SearchPickerModalProps<T> {
  open: boolean
  title: string
  onClose: () => void
  // 페이지(1 부터)와 검색어를 받아 목록을 조회하는 함수 (예: 생성 모델 UserModel.findpage)
  fetchItems: (page: number, keyword: string) => Promise<Page<T>>
  pageSize?: number // fetchItems 가 한 번에 가져오는 행 수 (전체 페이지 계산용, 기본 5)
  columns: DataTableColumn<T>[]
  rowKey: (item: T) => string | number
  onSelect: (item: T) => void // 행 클릭 = 선택 (선택 후 모달 닫힘)
  placeholder?: string
  emptyText?: string
}

// 모달 안에서 검색 + 목록 + 페이징으로 항목 하나를 고르는 컴포넌트.
// Modal / SearchInput / DataTable / Pagination 조합 예제이기도 하다.
// Modal 은 닫히면 아무것도 그리지 않으므로 본문(PickerBody)이 열릴 때마다 새로 마운트되어 검색 상태가 초기화된다.
export function SearchPickerModal<T>(
  props: Readonly<SearchPickerModalProps<T>>,
) {
  return (
    <Modal open={props.open} onClose={props.onClose} title={props.title}>
      <PickerBody {...props} />
    </Modal>
  )
}

interface FetchResult<T> {
  key: string // 이 결과를 만든 조회 조건 (page|검색어)
  data: Page<T> | null
  error: string | null
}

function PickerBody<T>({
  onClose,
  fetchItems,
  columns,
  rowKey,
  onSelect,
  placeholder = '검색어를 입력하세요',
  emptyText = '검색 결과가 없습니다.',
  pageSize = 5,
}: Readonly<SearchPickerModalProps<T>>) {
  const [keyword, setKeyword] = useState('') // 입력 중인 값
  const [applied, setApplied] = useState('') // 실제 조회에 반영된 검색어
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<FetchResult<T> | null>(null)

  // 현재 조건의 결과가 아직 없으면 불러오는 중 (이전 결과는 그대로 보여준다)
  const key = `${page}|${applied}`
  const loading = result?.key !== key
  const data = result?.data ?? null
  const error = result?.key === key ? result.error : null

  // 부모가 fetchItems 를 인라인 함수로 넘겨도 무한 재조회가 없도록 ref 로 보관
  const fetchRef = useRef(fetchItems)
  useEffect(() => {
    fetchRef.current = fetchItems
  })

  useEffect(() => {
    let cancelled = false
    const current = `${page}|${applied}`
    fetchRef
      .current(page, applied)
      .then((res) => {
        if (!cancelled) setResult({ key: current, data: res, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setResult((prev) => ({
            key: current,
            data: prev?.data ?? null,
            error: errorMessage(e, '목록을 불러오지 못했습니다.'),
          }))
      })
    return () => {
      cancelled = true
    }
  }, [page, applied])

  const handleSearch = () => {
    setApplied(keyword.trim())
    setPage(1)
  }

  const handleSelect = (item: T) => {
    onSelect(item)
    onClose()
  }

  return (
    <div className="picker-body">
      <SearchInput
        value={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
        placeholder={placeholder}
      />

      {error && <p className="error">{error}</p>}

      <div className="picker-list">
        {loading && !data ? (
          <p className="muted">불러오는 중…</p>
        ) : (
          data && (
            <DataTable
              columns={columns}
              data={data.items}
              rowKey={rowKey}
              onRowClick={handleSelect}
              emptyText={emptyText}
            />
          )
        )}
      </div>

      {data && (
        <Pagination
          page={page}
          totalPages={pageCount(data.total, pageSize)}
          onChange={setPage}
          blockSize={5}
        />
      )}
    </div>
  )
}
