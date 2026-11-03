// 앱 시작 때 한 번 부른다 (main.tsx). 토큰과 401 처리를 등록하는 유일한 곳이다.
// 생성 모델과 손으로 만든 api 모듈이 모두 같은 클라이언트(./client)를 쓰므로 여기서 한 번만 하면 된다.
import { setTokenProvider, setUnauthorizedHandler } from './client'
import { emitUnauthorized, getToken, setToken } from '../lib/authStorage'

export function setupApi(): void {
  // 로그인 상태면 모든 요청에 Authorization: Bearer <token> 을 싣는다.
  setTokenProvider(getToken)
  // 토큰 만료/무효(HTTP 401) → 저장된 토큰을 비우고 앱에 로그아웃을 알린다.
  setUnauthorizedHandler(() => {
    setToken(null)
    emitUnauthorized()
  })
}
