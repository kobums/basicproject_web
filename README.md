# basicproject_web

React + TypeScript + Vite 기반의 게시판/회원 관리 프론트엔드. JWT 인증, 게시판 CRUD(이미지 업로드 포함), 회원 관리 기능을 제공하며 Spring Boot 백엔드(`:8007`)와 연동된다.

## 기술 스택

- **React 19** + **TypeScript**
- **Vite** — 개발 서버 / 번들러
- **React Router v7** — 클라이언트 라우팅
- **oxlint** + **Prettier** — 린트 / 포맷
- 인증: JWT (localStorage 보관)
- HTTP: 자체 작성한 얇은 `fetch` 래퍼 (`src/api/client.ts`)

## 주요 기능

- **인증** — 로그인 / 회원가입, JWT 발급·복구, 401 시 자동 로그아웃
- **게시판** — 목록(검색·페이지네이션) / 상세 / 작성 / 수정 / 삭제, 이미지 업로드(multipart)
- **회원 관리** — 목록 / 작성 / 수정
- **보호 라우트** — `RequireAuth`로 비로그인 접근 차단 후 원래 경로로 복귀

## 시작하기

### 사전 요구사항

- Node.js 18+ (권장 20+)
- 백엔드 서버가 `http://localhost:8007`에서 실행 중 (API/이미지 제공)

### 설치 및 실행

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 뜬다. `/api`, `/uploads` 요청은 Vite 프록시를 통해 백엔드(`:8007`)로 전달된다(같은 출처로 묶여 CORS preflight 회피).

### 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `VITE_API_BASE_URL` | `/api` | 프론트엔드가 호출할 API 베이스 URL |

- 공개 가능한 기본값은 `.env`에 두고 커밋한다.
- 로컬에서만 다르게 쓰려면 `.env.local`을 만들어 override 한다(이 파일은 git에서 제외됨).

```bash
cp .env.local.example .env.local
```

> ⚠️ `VITE_*` 변수는 빌드 시 브라우저 번들에 그대로 포함된다. **시크릿/비밀키를 절대 넣지 말 것.**

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 타입 체크(`tsc -b`) 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | oxlint 실행 |
| `npm run format` | Prettier로 전체 포맷 |
| `npm run format:check` | 포맷 검사(쓰기 없음) |

## 라우트

| 경로 | 페이지 | 인증 |
|------|--------|------|
| `/` | 게시판 목록 | 공개 |
| `/boards/:id` | 게시글 상세 | 공개 |
| `/boards/new` | 게시글 작성 | 필요 |
| `/boards/:id/edit` | 게시글 수정 | 필요 |
| `/users` | 회원 목록 | 공개 |
| `/users/new` | 회원 작성 | 필요 |
| `/users/:id/edit` | 회원 수정 | 필요 |
| `/login`, `/signup` | 로그인 / 회원가입 | 공개 |

## 프로젝트 구조

```
src/
├── api/         # 백엔드 호출 (client 래퍼, auth/boards/users)
├── components/  # 공용 UI (Modal, Pagination, SearchBar, 폼, Provider 등)
├── context/     # React Context (auth, feedback)
├── hooks/       # 데이터 로딩 훅 (useBoard(s), useUser(s))
├── lib/         # 유틸 (authStorage, format)
├── pages/       # 라우트별 페이지
├── types/       # 공유 타입 정의
├── App.tsx      # 레이아웃 + 라우팅
└── main.tsx     # 엔트리포인트
```

## 라이선스

Private (학습용 프로젝트).
