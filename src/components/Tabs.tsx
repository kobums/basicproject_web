export interface TabItem {
  label: string
  value: string
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
}

// 밑줄 스타일 탭 바. 내용 전환은 부모가 value 로 처리한다.
export function Tabs({ tabs, value, onChange }: Readonly<TabsProps>) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          className={`tab-btn${tab.value === value ? ' active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
