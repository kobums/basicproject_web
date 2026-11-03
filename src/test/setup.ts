// vitest 공통 준비. node 환경에서는 앱 코드가 쓰는 브라우저 전역(localStorage, window 이벤트)만 작게 흉내 낸다.
// happy-dom 환경(화면 스모크 테스트)에서는 진짜 전역을 그대로 쓴다.
import { vi } from 'vitest'

if (typeof window === 'undefined') {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  })
  vi.stubGlobal('window', new EventTarget())
}
