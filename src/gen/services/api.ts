// 사용자 파일이다 (생성 머리줄 없음). gomachine 은 {tsOutDir}/services/api.ts 가 없을 때만 만들고, 있으면 덮어쓰지 않는다.
// 생성 모델(../models/*.ts)이 쓰는 get / post / put / patch / del 은 앱의 단 하나뿐인 HTTP 클라이언트(src/api/client.ts)다.
// 토큰 / 401 처리도 그쪽에 한 번만 등록한다 (src/api/setup.ts).
export * from '../../api/client'
