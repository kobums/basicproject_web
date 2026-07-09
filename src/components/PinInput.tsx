import { useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

interface PinInputProps {
  value: string // 최대 length 자리 숫자 문자열
  onChange: (value: string) => void
  length?: number
}

// 인증번호(OTP) 입력. 한 자리 치면 다음 칸으로, Backspace 는 이전 칸으로,
// 붙여넣기는 전체를 한 번에 채운다.
export function PinInput({ value, onChange, length = 6 }: Readonly<PinInputProps>) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const setDigit = (index: number, digit: string) => {
    const chars = value.split('')
    // 빈 칸을 유지하기 위해 length 만큼 패딩
    while (chars.length < length) chars.push('')
    chars[index] = digit
    onChange(chars.join('').slice(0, length))
  }

  const handleInput = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1) // 숫자만, 마지막 글자만
    setDigit(index, digit)
    if (digit && index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus()
      setDigit(index - 1, '')
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(digits)
    refs.current[Math.min(digits.length, length - 1)]?.focus()
  }

  return (
    <div className="pin-input" onPaste={handlePaste}>
      {Array.from({ length }, (_, i) => (
        <input
          // 자릿수 고정 배열이라 인덱스 키 안전
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={value[i] ? 'filled' : ''}
          value={value[i] ?? ''}
          aria-label={`${i + 1}번째 자리`}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  )
}
