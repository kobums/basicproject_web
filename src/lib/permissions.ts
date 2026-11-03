// 화면에서 쓰는 권한 판단 (버튼 / 메뉴를 보일지 정할 뿐이다. 실제 권한 검사는 백엔드가 한다).
//   관리자: user.level >= ADMIN_LEVEL. model.json 의 adminLevel 과 같아야 한다 (기본 3, VITE_ADMIN_LEVEL 로 바꾼다).
//   게시글 작성자: board.user (작성자 id, 서버가 로그인 사용자로 채운다) === 로그인 사용자 id.
import type { Board } from '../gen/types/board'
import type { User } from '../gen/types/user'

function parseLevel(v: string | undefined): number {
  const n = Number(v)
  return v && Number.isInteger(n) ? n : 3
}

export const ADMIN_LEVEL = parseLevel(import.meta.env.VITE_ADMIN_LEVEL)

/** 관리자인지 (모든 회원을 읽고 수정 / 삭제할 수 있다). */
export function isAdmin(user: Pick<User, 'level'> | null | undefined): boolean {
  return user != null && user.level >= ADMIN_LEVEL
}

/** 이 게시글의 작성자인지 (수정 / 삭제는 작성자만 된다). */
export function isBoardOwner(
  user: Pick<User, 'id'> | null | undefined,
  board: Pick<Board, 'user'>,
): boolean {
  return user != null && board.user === user.id
}

/** 이 회원 정보를 수정 / 삭제할 수 있는지 (본인 또는 관리자). */
export function canManageUser(
  user: Pick<User, 'id' | 'level'> | null | undefined,
  target: Pick<User, 'id'>,
): boolean {
  return user != null && (user.id === target.id || isAdmin(user))
}
