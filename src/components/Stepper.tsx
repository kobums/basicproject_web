interface StepperProps {
  steps: string[]
  current: number // 0-based 현재 단계
}

// 다단계 진행 표시기. current 이전은 완료(✓), current 는 강조.
export function Stepper({ steps, current }: Readonly<StepperProps>) {
  const stateOf = (index: number) => {
    if (index < current) return ' done'
    if (index === current) return ' active'
    return ''
  }

  return (
    <ol className="stepper">
      {steps.map((step, index) => (
        <li key={step} className={stateOf(index).trim()}>
          <span className="step-dot">{index < current ? '✓' : index + 1}</span>
          <span>{step}</span>
          {index < steps.length - 1 && (
            <span className="step-line" aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  )
}
