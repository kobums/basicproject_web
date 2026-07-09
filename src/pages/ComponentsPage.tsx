import { useCallback, useState } from 'react'
import { PageTitle } from '../components/PageTitle'
import { StatusBadge } from '../components/StatusBadge'
import type { BadgeVariant } from '../components/StatusBadge'
import { Tooltip } from '../components/Tooltip'
import { Empty } from '../components/Empty'
import { Spinner } from '../components/Spinner'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Dropdown } from '../components/Dropdown'
import { Checkbox } from '../components/Checkbox'
import { CheckboxGroup } from '../components/CheckboxGroup'
import { RadioGroup } from '../components/RadioGroup'
import { SearchInput } from '../components/SearchInput'
import { Datepicker } from '../components/Datepicker'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { SearchPickerModal } from '../components/SearchPickerModal'
import { FilterSelect } from '../components/FilterSelect'
import { FilterPanel } from '../components/FilterPanel'
import { Tabs } from '../components/Tabs'
import { Accordion } from '../components/Accordion'
import { Alert } from '../components/Alert'
import { Switch } from '../components/Switch'
import { Chip } from '../components/Chip'
import { ProgressBar } from '../components/ProgressBar'
import { Skeleton } from '../components/Skeleton'
import { Avatar } from '../components/Avatar'
import { Breadcrumb } from '../components/Breadcrumb'
import { Drawer } from '../components/Drawer'
import { FileUpload } from '../components/FileUpload'
import { Stepper } from '../components/Stepper'
import { Card } from '../components/Card'
import { MenuDropdown } from '../components/MenuDropdown'
import { Combobox } from '../components/Combobox'
import { TagInput } from '../components/TagInput'
import { NumberInput } from '../components/NumberInput'
import { Slider } from '../components/Slider'
import { Rating } from '../components/Rating'
import { SegmentedControl } from '../components/SegmentedControl'
import { Timeline } from '../components/Timeline'
import { DescriptionList } from '../components/DescriptionList'
import { ImageLightbox } from '../components/ImageLightbox'
import { CopyButton } from '../components/CopyButton'
import { Calendar } from '../components/Calendar'
import { Carousel } from '../components/Carousel'
import { Tree } from '../components/Tree'
import { PinInput } from '../components/PinInput'
import { BottomSheet } from '../components/BottomSheet'
import { AvatarGroup } from '../components/AvatarGroup'
import { RangeSlider } from '../components/RangeSlider'
import { TextClamp } from '../components/TextClamp'
import { InfiniteScroll } from '../components/InfiniteScroll'
import { BackToTop } from '../components/BackToTop'
import { ListManager } from '../components/ListManager'
import type { ListManagerItem } from '../components/ListManager'
import heroImg from '../assets/hero.png'
import { useLoading } from '../context/loading'
import { useFeedback } from '../context/feedback'
import { fetchUsers } from '../api/users'
import type { User } from '../types/user'

// ---- DataTable 데모용 샘플 데이터 ----
interface DemoRow {
  id: number
  name: string
  role: string
  status: string
  joinedAt: string
}

const DEMO_ROWS: DemoRow[] = [
  {
    id: 1,
    name: '홍길동',
    role: '관리자',
    status: '활성',
    joinedAt: '2026-01-12',
  },
  {
    id: 2,
    name: '김영희',
    role: '편집자',
    status: '대기',
    joinedAt: '2026-03-02',
  },
  {
    id: 3,
    name: '이철수',
    role: '뷰어',
    status: '정지',
    joinedAt: '2026-05-21',
  },
]

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  활성: 'green',
  대기: 'blue',
  정지: 'red',
}

// 다음 피드 배치 10개를 생성 (순수 함수 — 중첩 함수 깊이를 낮추려 컴포넌트 밖으로 분리)
const nextFeedBatch = (fromLength: number): number[] =>
  Array.from({ length: 10 }, (_, i) => fromLength + i + 1)

export function ComponentsPage() {
  const notify = useFeedback()
  const loading = useLoading()

  // 폼 계열 상태
  const [text, setText] = useState('')
  const [memo, setMemo] = useState('')
  const [fruit, setFruit] = useState('apple')
  const [dropdownValue, setDropdownValue] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [hobbies, setHobbies] = useState<string[]>(['reading'])
  const [gender, setGender] = useState('none')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [date, setDate] = useState('')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')

  // SearchPickerModal
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickedUser, setPickedUser] = useState<User | null>(null)

  // 신규 컴포넌트 데모 상태
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [filterName, setFilterName] = useState('')
  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd] = useState('')
  const [tab, setTab] = useState('info')
  const [darkMode, setDarkMode] = useState(false)
  const [chips, setChips] = useState(['React', 'Vue', 'Spring Boot'])
  const [progress, setProgress] = useState(35)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [step, setStep] = useState(1)

  // 2차 신규 컴포넌트 데모 상태
  const [combo, setCombo] = useState('')
  const [tags, setTags] = useState<string[]>(['react', 'vue'])
  const [count, setCount] = useState(3)
  const [volume, setVolume] = useState(40)
  const [stars, setStars] = useState(3)
  const [view, setView] = useState('list')

  // 3차 신규 컴포넌트 데모 상태
  const [calDate, setCalDate] = useState('')
  const [pin, setPin] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [rangeMin, setRangeMin] = useState(20)
  const [rangeMax, setRangeMax] = useState(70)
  const [feed, setFeed] = useState(() => nextFeedBatch(0))
  const [feedLoading, setFeedLoading] = useState(false)
  const feedHasMore = feed.length < 30
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({
    key: 'id',
    dir: 'asc',
  })

  // 4차 신규 컴포넌트 데모 상태
  const [todos, setTodos] = useState<ListManagerItem[]>([
    { id: 1, label: '백로그 정리' },
    { id: 2, label: 'API 명세 작성' },
    { id: 3, label: '컴포넌트 데모 추가' },
    { id: 4, label: '코드 리뷰' },
  ])

  const loadMoreFeed = () => {
    setFeedLoading(true)
    // 실제로는 API 호출 — 데모는 500ms 지연 후 10개 추가
    setTimeout(() => {
      setFeed((prev) => [...prev, ...nextFeedBatch(prev.length)])
      setFeedLoading(false)
    }, 500)
  }

  const removeChip = (chip: string) =>
    setChips((prev) => prev.filter((c) => c !== chip))

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' },
    )
  }

  const sortedRows = [...DEMO_ROWS].sort((a, b) => {
    const av = String(a[sort.key as keyof DemoRow])
    const bv = String(b[sort.key as keyof DemoRow])
    const cmp = av.localeCompare(bv, 'ko', { numeric: true })
    return sort.dir === 'asc' ? cmp : -cmp
  })

  const fetchPickerUsers = useCallback(
    (page: number, keyword: string) => fetchUsers(page, keyword, 5),
    [],
  )

  const userColumns: DataTableColumn<User>[] = [
    { key: 'id', header: '번호', width: '64px', align: 'center' },
    { key: 'name', header: '이름' },
    { key: 'email', header: '이메일' },
  ]

  const demoColumns: DataTableColumn<DemoRow>[] = [
    { key: 'id', header: '번호', width: '64px', align: 'center' },
    { key: 'name', header: '이름' },
    { key: 'role', header: '역할' },
    {
      key: 'status',
      header: '상태',
      width: '90px',
      align: 'center',
      render: (row) => (
        <StatusBadge
          label={row.status}
          variant={STATUS_VARIANT[row.status] ?? 'gray'}
        />
      ),
    },
    { key: 'joinedAt', header: '가입일', width: '120px' },
  ]

  // 정렬 데모: 번호/이름/가입일만 정렬 가능으로 표시
  const sortableColumns: DataTableColumn<DemoRow>[] = demoColumns.map(
    (col) => ({
      ...col,
      sortable:
        col.key === 'id' || col.key === 'name' || col.key === 'joinedAt',
    }),
  )

  const showLoadingDemo = () => {
    loading.show()
    setTimeout(loading.hide, 1500)
  }

  return (
    <section className="page">
      <PageTitle
        title="컴포넌트"
        desc="blueprintsecurity 프론트의 공용 컴포넌트를 basicproject 스타일로 재구현한 데모."
        kpis={[
          { label: '전체 컴포넌트', value: 55, accent: true },
          { label: '표시 계열', value: 28 },
          { label: '폼 계열', value: 21 },
          { label: '복합 계열', value: 6 },
        ]}
      />

      <div className="demo-section">
        <h2>StatusBadge</h2>
        <div className="demo-row">
          <StatusBadge label="허용" variant="green" />
          <StatusBadge label="거부" variant="red" />
          <StatusBadge label="미사용" variant="gray" />
          <StatusBadge label="검토중" variant="blue" />
          <StatusBadge label="S등급" variant="purple" />
        </div>
      </div>

      <div className="demo-section">
        <h2>Tooltip</h2>
        <div className="demo-row">
          <span>
            기본 아이콘 트리거{' '}
            <Tooltip text="ⓘ 아이콘에 마우스를 올리면 표시됩니다." />
          </span>
          <Tooltip text="커스텀 요소도 트리거가 될 수 있습니다.">
            <button type="button" className="btn btn-sm">
              hover me
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="demo-section">
        <h2>Input / Select / Dropdown</h2>
        <div className="demo-grid">
          <Input
            label="이름"
            value={text}
            onChange={setText}
            placeholder="이름을 입력하세요"
            hint="최대 255자까지 입력할 수 있습니다."
          />
          <Input
            label="이메일 (에러 상태)"
            value=""
            onChange={() => {}}
            placeholder="user@example.com"
            error="이메일 형식이 올바르지 않습니다."
          />
          <Select
            label="과일 (네이티브 select)"
            value={fruit}
            onChange={setFruit}
            options={[
              { label: '사과', value: 'apple' },
              { label: '바나나', value: 'banana' },
              { label: '포도', value: 'grape' },
            ]}
          />
          <div className="field">
            <span>부서 (커스텀 Dropdown)</span>
            <Dropdown
              value={dropdownValue}
              onChange={setDropdownValue}
              placeholder="부서를 선택하세요"
              resetLabel="전체"
              options={[
                { label: '개발팀', value: 'dev' },
                { label: '디자인팀', value: 'design' },
                { label: '기획팀', value: 'plan' },
              ]}
            />
          </div>
        </div>
        <Input
          label="메모 (multiline)"
          value={memo}
          onChange={setMemo}
          multiline
          rows={3}
          placeholder="여러 줄 입력"
        />
      </div>

      <div className="demo-section">
        <h2>Checkbox / CheckboxGroup / RadioGroup</h2>
        <div className="demo-row">
          <Checkbox
            id="agree"
            label="약관에 동의합니다"
            checked={agreed}
            onChange={setAgreed}
          />
        </div>
        <div className="demo-row">
          <CheckboxGroup
            name="hobby"
            values={hobbies}
            onChange={setHobbies}
            options={[
              { label: '독서', value: 'reading' },
              { label: '운동', value: 'workout' },
              { label: '게임', value: 'game' },
            ]}
          />
          <span className="demo-value">
            선택: <code>{JSON.stringify(hobbies)}</code>
          </span>
        </div>
        <div className="demo-row">
          <RadioGroup
            name="gender"
            value={gender}
            onChange={setGender}
            options={[
              { label: '선택 안 함', value: 'none' },
              { label: '남성', value: 'male' },
              { label: '여성', value: 'female' },
            ]}
          />
          <span className="demo-value">
            선택: <code>{gender}</code>
          </span>
        </div>
      </div>

      <div className="demo-section">
        <h2>SearchInput / Datepicker / DateRangeFilter</h2>
        <div className="demo-row">
          <SearchInput
            value={searchKeyword}
            onChange={setSearchKeyword}
            onSearch={() =>
              notify({
                type: 'success',
                message: `'${searchKeyword}' 검색 실행`,
              })
            }
          />
        </div>
        <div className="demo-grid">
          <Datepicker label="날짜" value={date} onChange={setDate} />
          <DateRangeFilter
            label="조회 기간"
            start={rangeStart}
            end={rangeEnd}
            onStartChange={setRangeStart}
            onEndChange={setRangeEnd}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>DataTable</h2>
        <DataTable
          columns={demoColumns}
          data={DEMO_ROWS}
          rowKey={(row) => row.id}
          onRowClick={(row) =>
            notify({ type: 'success', message: `${row.name} 행 클릭` })
          }
        />
      </div>

      <div className="demo-section">
        <h2>Empty</h2>
        <Empty text="검색 결과가 없습니다." />
      </div>

      <div className="demo-section">
        <h2>Spinner / LoadingOverlay</h2>
        <div className="demo-row">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <button type="button" className="btn" onClick={showLoadingDemo}>
            전역 로딩 1.5초 표시
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h2>SearchPickerModal</h2>
        <div className="demo-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setPickerOpen(true)}
          >
            회원 선택
          </button>
          {pickedUser && (
            <span className="demo-value">
              선택된 회원: <code>{pickedUser.name ?? pickedUser.email}</code>
            </span>
          )}
        </div>
        <SearchPickerModal
          open={pickerOpen}
          title="회원 선택"
          onClose={() => setPickerOpen(false)}
          fetchItems={fetchPickerUsers}
          columns={userColumns}
          rowKey={(u) => u.id}
          onSelect={(u) => {
            setPickedUser(u)
            notify({ type: 'success', message: `${u.name ?? u.email} 선택됨` })
          }}
          placeholder="이름 또는 이메일로 검색"
        />
      </div>

      <div className="demo-section">
        <h2>FilterSelect / FilterPanel</h2>
        <div className="demo-row">
          <FilterSelect
            title="상태"
            values={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: '활성', value: 'active' },
              { label: '대기', value: 'pending' },
              { label: '정지', value: 'banned' },
            ]}
          />
          <FilterPanel
            onReset={() => {
              setFilterName('')
              setFilterStart('')
              setFilterEnd('')
            }}
            onSearch={() =>
              notify({
                type: 'success',
                message: `상세검색: 이름=${filterName || '(없음)'}, 기간=${filterStart || '?'}~${filterEnd || '?'}`,
              })
            }
          >
            <Input
              label="이름"
              value={filterName}
              onChange={setFilterName}
              placeholder="이름"
            />
            <DateRangeFilter
              label="기간"
              start={filterStart}
              end={filterEnd}
              onStartChange={setFilterStart}
              onEndChange={setFilterEnd}
            />
          </FilterPanel>
          <span className="demo-value">
            필터: <code>{JSON.stringify(statusFilter)}</code>
          </span>
        </div>
      </div>

      <div className="demo-section">
        <h2>Tabs</h2>
        <Tabs
          tabs={[
            { label: '정보', value: 'info' },
            { label: '설정', value: 'settings' },
            { label: '이력', value: 'history' },
          ]}
          value={tab}
          onChange={setTab}
        />
        <p className="demo-value">
          현재 탭: <code>{tab}</code>
        </p>
      </div>

      <div className="demo-section">
        <h2>Accordion</h2>
        <Accordion
          defaultOpen={[0]}
          items={[
            {
              title: '이 프로젝트는 무엇인가요?',
              content:
                '학습용 풀스택 프로젝트입니다. Spring Boot + React + Vue 로 같은 기능을 구현합니다.',
            },
            {
              title: '백엔드 포트는?',
              content: '8081 입니다. 8080 은 다른 프로젝트가 사용 중입니다.',
            },
            {
              title: '상태 관리는?',
              content:
                '라이브러리 없이 Context(React)와 모듈 스코프 ref(Vue)로 직접 구현했습니다.',
            },
          ]}
        />
      </div>

      <div className="demo-section">
        <h2>Alert</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Alert variant="info" title="안내">
            읽어 두면 좋은 정보성 메시지입니다.
          </Alert>
          <Alert variant="success">저장이 완료되었습니다.</Alert>
          <Alert variant="warning" title="주의">
            공유 DB이므로 스키마 변경에 주의하세요.
          </Alert>
          <Alert variant="error" title="오류" closable>
            요청 처리 중 문제가 발생했습니다. (닫기 가능)
          </Alert>
        </div>
      </div>

      <div className="demo-section">
        <h2>Switch / Chip</h2>
        <div className="demo-row">
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            label={`다크 모드 ${darkMode ? 'ON' : 'OFF'}`}
          />
        </div>
        <div className="demo-row">
          {chips.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              accent
              onRemove={() => removeChip(chip)}
            />
          ))}
          <Chip label="삭제 불가 칩" />
          {chips.length < 3 && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setChips(['React', 'Vue', 'Spring Boot'])}
            >
              칩 복원
            </button>
          )}
        </div>
      </div>

      <div className="demo-section">
        <h2>ProgressBar / Stepper</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ProgressBar value={progress} label="업로드 진행률" />
          <div className="demo-row">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setProgress((p) => Math.max(0, p - 15))}
            >
              -15
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setProgress((p) => Math.min(100, p + 15))}
            >
              +15
            </button>
          </div>
          <Stepper steps={['정보 입력', '내용 확인', '완료']} current={step} />
          <div className="demo-row">
            <button
              type="button"
              className="btn btn-sm"
              disabled={step <= 0}
              onClick={() => setStep((s) => s - 1)}
            >
              이전 단계
            </button>
            <button
              type="button"
              className="btn btn-sm"
              disabled={step >= 2}
              onClick={() => setStep((s) => s + 1)}
            >
              다음 단계
            </button>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Skeleton / Avatar</h2>
        <div className="demo-row">
          <Skeleton circle width="40px" height="40px" />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <Skeleton width="40%" />
            <Skeleton width="70%" />
          </div>
        </div>
        <div className="demo-row">
          <Avatar name="홍길동" size="sm" />
          <Avatar name="김영희" />
          <Avatar name="이철수" size="lg" />
          <Avatar name="Claude" />
        </div>
      </div>

      <div className="demo-section">
        <h2>Breadcrumb / Card</h2>
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: '회원', to: '/users' },
            { label: '컴포넌트' },
          ]}
        />
        <Card
          title="카드 제목"
          extra={<StatusBadge label="NEW" variant="blue" />}
          footer={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                notify({ type: 'success', message: '카드 액션 실행' })
              }
            >
              확인
            </button>
          }
        >
          헤더/본문/푸터로 구성된 카드 컨테이너입니다. 대시보드 위젯이나 요약
          정보 배치에 사용합니다.
        </Card>
      </div>

      <div className="demo-section">
        <h2>Drawer</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setDrawerOpen(true)}
        >
          드로어 열기
        </button>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="상세 정보"
        >
          <p>
            오른쪽에서 슬라이드되어 나오는 패널입니다. 목록에서 행을 눌렀을 때
            페이지 이동 없이 상세를 보여주는 용도로 씁니다.
          </p>
          <p style={{ marginTop: 12 }}>ESC 또는 배경 클릭으로 닫힙니다.</p>
        </Drawer>
      </div>

      <div className="demo-section">
        <h2>FileUpload</h2>
        <FileUpload
          files={uploadFiles}
          onChange={setUploadFiles}
          accept="image/*"
          multiple
        />
      </div>

      <div className="demo-section">
        <h2>MenuDropdown / CopyButton</h2>
        <div className="demo-row">
          <MenuDropdown
            items={[
              {
                label: '수정',
                onClick: () =>
                  notify({ type: 'success', message: '수정 클릭' }),
              },
              {
                label: '복제',
                onClick: () =>
                  notify({ type: 'success', message: '복제 클릭' }),
              },
              {
                label: '삭제',
                danger: true,
                divider: true,
                onClick: () => notify({ type: 'error', message: '삭제 클릭' }),
              },
            ]}
          />
          <CopyButton text="npm run dev" label="명령어 복사" />
          <code>npm run dev</code>
        </div>
      </div>

      <div className="demo-section">
        <h2>Combobox / TagInput</h2>
        <div className="demo-grid">
          <div className="field">
            <span>과일 자동완성</span>
            <Combobox
              value={combo}
              onChange={setCombo}
              options={[
                '사과',
                '바나나',
                '포도',
                '딸기',
                '수박',
                '복숭아',
                '파인애플',
              ]}
            />
          </div>
          <div className="field">
            <span>태그 (Enter 로 추가)</span>
            <TagInput tags={tags} onChange={setTags} max={5} />
            <small className="field-hint">
              선택: <code>{JSON.stringify(tags)}</code>
            </small>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>NumberInput / Slider / Rating / SegmentedControl</h2>
        <div className="demo-row">
          <NumberInput value={count} onChange={setCount} min={0} max={10} />
          <span className="demo-value">
            수량: <code>{count}</code>
          </span>
        </div>
        <div className="demo-row">
          <Slider value={volume} onChange={setVolume} />
        </div>
        <div className="demo-row">
          <Rating value={stars} onChange={setStars} />
          <span className="demo-value">
            별점: <code>{stars}</code>
          </span>
        </div>
        <div className="demo-row">
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { label: '목록', value: 'list' },
              { label: '카드', value: 'card' },
              { label: '달력', value: 'calendar' },
            ]}
          />
          <span className="demo-value">
            보기: <code>{view}</code>
          </span>
        </div>
      </div>

      <div className="demo-section">
        <h2>Timeline / DescriptionList</h2>
        <div className="demo-grid">
          <Timeline
            items={[
              {
                title: '프로젝트 생성',
                time: '2026-06-28',
                description: 'Spring Boot + React 스캐폴드',
              },
              { title: 'JWT 인증 추가', time: '2026-06-29' },
              {
                title: 'Vue 포팅',
                time: '2026-07-05',
                description: 'basicproject_vue 생성',
              },
              { title: '배포', time: '예정', muted: true },
            ]}
          />
          <DescriptionList
            items={[
              { label: '프로젝트', value: 'basicproject' },
              { label: '백엔드', value: 'Spring Boot (:8081)' },
              {
                label: '상태',
                value: <StatusBadge label="진행중" variant="blue" />,
              },
            ]}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>ImageLightbox</h2>
        <p className="demo-value">이미지를 클릭하면 크게 보기</p>
        <ImageLightbox
          className="img-preview"
          src={heroImg}
          alt="샘플 이미지"
        />
      </div>

      <div className="demo-section">
        <h2>Calendar</h2>
        <div className="demo-row" style={{ alignItems: 'flex-start' }}>
          <Calendar value={calDate} onChange={setCalDate} />
          <span className="demo-value">
            선택: <code>{calDate || '(없음)'}</code>
          </span>
        </div>
      </div>

      <div className="demo-section">
        <h2>Carousel</h2>
        <Carousel
          slides={[
            { src: heroImg, alt: '슬라이드 1' },
            { src: heroImg, alt: '슬라이드 2' },
            { src: heroImg, alt: '슬라이드 3' },
          ]}
        />
      </div>

      <div className="demo-section">
        <h2>Tree</h2>
        <Tree
          onSelect={(label) =>
            notify({ type: 'success', message: `${label} 선택` })
          }
          nodes={[
            {
              label: 'src',
              children: [
                {
                  label: 'components',
                  children: [
                    { label: 'Modal.tsx' },
                    { label: 'DataTable.tsx' },
                  ],
                },
                { label: 'pages', children: [{ label: 'BoardListPage.tsx' }] },
                { label: 'main.tsx' },
              ],
            },
            { label: 'package.json' },
          ]}
        />
      </div>

      <div className="demo-section">
        <h2>PinInput</h2>
        <div className="demo-row">
          <PinInput value={pin} onChange={setPin} />
          <span className="demo-value">
            입력: <code>{pin || '(없음)'}</code>
          </span>
        </div>
      </div>

      <div className="demo-section">
        <h2>BottomSheet</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setSheetOpen(true)}
        >
          바텀시트 열기
        </button>
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="옵션 선택"
        >
          <p>
            아래에서 올라오는 시트입니다. 모바일에서 모달 대신 자주 쓰는
            패턴입니다.
          </p>
          <div className="board-form-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSheetOpen(false)}
            >
              확인
            </button>
          </div>
        </BottomSheet>
      </div>

      <div className="demo-section">
        <h2>AvatarGroup / RangeSlider</h2>
        <div className="demo-row">
          <AvatarGroup
            names={['홍길동', '김영희', '이철수', 'Claude', '박민수', '최지우']}
          />
        </div>
        <div className="demo-row">
          <RangeSlider
            start={rangeMin}
            end={rangeMax}
            onStartChange={setRangeMin}
            onEndChange={setRangeMax}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>TextClamp</h2>
        <TextClamp
          lines={2}
          text={
            'basicproject 는 기본기 학습용 풀스택 프로젝트입니다. Spring Boot 백엔드 위에 React 와 Vue 로 같은 화면을 두 번 구현하면서 프레임워크 간 개념 대응을 익힙니다. 게시판 CRUD, JWT 인증, 파일 업로드, 검색과 페이징까지 실무에서 자주 쓰는 기능을 라이브러리 없이 직접 만들어 보고, 공용 컴포넌트 라이브러리도 처음부터 쌓아 올립니다. 이 문단은 TextClamp 데모를 위해 일부러 길게 작성되었습니다.'
          }
        />
      </div>

      <div className="demo-section">
        <h2>DataTable 정렬</h2>
        <p className="demo-value">
          번호/이름/가입일 헤더를 클릭하면 정렬됩니다.
        </p>
        <DataTable
          columns={sortableColumns}
          data={sortedRows}
          rowKey={(row) => row.id}
          sortKey={sort.key}
          sortDir={sort.dir}
          onSort={handleSort}
        />
      </div>

      <div className="demo-section">
        <h2>InfiniteScroll</h2>
        <p className="demo-value">
          아래로 스크롤하면 30개까지 자동으로 더 불러옵니다. (현재 {feed.length}
          개)
        </p>
        <InfiniteScroll
          hasMore={feedHasMore}
          loading={feedLoading}
          onLoadMore={loadMoreFeed}
        >
          <ul className="file-list" data-testid="feed">
            {feed.map((n) => (
              <li key={n}>피드 항목 #{n}</li>
            ))}
          </ul>
        </InfiniteScroll>
        {!feedHasMore && <p className="muted">모두 불러왔습니다.</p>}
      </div>

      <div className="demo-section">
        <h2>ListManager</h2>
        <p className="demo-value">
          드래그로 순서 변경, 검색으로 필터링, 하단 입력으로 추가, 체크박스로
          선택 후 일괄 삭제할 수 있습니다.
        </p>
        <ListManager items={todos} onChange={setTodos} />
        <p className="demo-value">
          순서:{' '}
          <code>{todos.map((t) => t.label).join(' → ') || '(비어 있음)'}</code>
        </p>
      </div>

      <BackToTop />
    </section>
  )
}
