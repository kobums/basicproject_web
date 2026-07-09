export interface KpiItem {
  label: string
  value: number | string
  accent?: boolean // 강조 카드 (전체 합계 등)
}

interface PageTitleProps {
  title: string
  desc?: string
  kpis?: KpiItem[]
}

// 페이지 제목 + 설명 + 선택적 KPI 통계 카드.
export function PageTitle({ title, desc, kpis }: Readonly<PageTitleProps>) {
  return (
    <header className="page-title">
      <h1>{title}</h1>
      {desc && <p className="desc">{desc}</p>}
      {kpis && kpis.length > 0 && (
        <div className="kpi-cards">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`kpi-card${kpi.accent ? ' accent' : ''}`}
            >
              <span className="kpi-label">{kpi.label}</span>
              <strong className="kpi-value">{kpi.value}</strong>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
