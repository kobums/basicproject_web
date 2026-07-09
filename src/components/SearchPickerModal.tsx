import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { SearchInput } from './SearchInput'
import { DataTable } from './DataTable'
import type { DataTableColumn } from './DataTable'
import { Pagination } from './Pagination'
import type { PageResponse } from '../types/page'

interface SearchPickerModalProps<T> {
  open: boolean
  title: string
  onClose: () => void
  // 페이지(0-based)와 검색어를 받아 목록을 조회하는 함수 (예: 회원 목록 API)
  fetchItems: (page: number, keyword: string) => Promise<PageResponse<T>>
  columns: DataTableColumn<T>[]
  rowKey: (item: T) => string | number
  onSelect: (item: T) => void // 행 클릭 = 선택 (선택 후 모달 닫힘)
  placeholder?: string
  emptyText?: string
}

// 모달 안에서 검색 + 목록 + 페이징으로 항목 하나를 고르는 컴포넌트.
// Modal / SearchInput / DataTable / Pagination 조합 예제이기도 하다.
export function SearchPickerModal<T>({
  open,
  title,
  onClose,
  fetchItems,
  columns,
  rowKey,
  onSelect,
  placeholder = '검색어를 입력하세요',
  emptyText = '검색 결과가 없습니다.',
}: Readonly<SearchPickerModalProps<T>>) {
  const [keyword, setKeyword] = useState('') // 입력 중인 값
  const [applied, setApplied] = useState('') // 실제 조회에 반영된 검색어
  const [page, setPage] = useState(0)
  const [data, setData] = useState<PageResponse<T> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 부모가 fetchItems 를 인라인 함수로 넘겨도 무한 재조회가 없도록 ref 로 보관
  const fetchRef = useRef(fetchItems)
  useEffect(() => {
    fetchRef.current = fetchItems
  })

  // 열릴 때마다 검색 상태 초기화
  useEffect(() => {
    if (!open) return
    setKeyword('')
    setApplied('')
    setPage(0)
  }, [open])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchRef
      .current(page, applied)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : '목록을 불러오지 못했습니다.',
          )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, page, applied])

  const handleSearch = () => {
    setApplied(keyword.trim())
    setPage(0)
  }

  const handleSelect = (item: T) => {
    onSelect(item)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
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
                data={data.content}
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
            totalPages={data.totalPages}
            onChange={setPage}
            blockSize={5}
          />
        )}
      </div>
    </Modal>
  )
}
