import { describe, expect, it } from 'vitest'
import {
  ADMIN_LEVEL,
  canManageUser,
  isAdmin,
  isBoardOwner,
} from './permissions'

describe('permissions', () => {
  it('관리자 = level >= ADMIN_LEVEL (기본 3)', () => {
    expect(ADMIN_LEVEL).toBe(3)
    expect(isAdmin({ level: 3 })).toBe(true)
    expect(isAdmin({ level: 5 })).toBe(true)
    expect(isAdmin({ level: 1 })).toBe(false)
    expect(isAdmin(null)).toBe(false)
  })

  it('게시글 작성자 = board.user === 로그인 사용자 id', () => {
    expect(isBoardOwner({ id: 7 }, { user: 7 })).toBe(true)
    expect(isBoardOwner({ id: 8 }, { user: 7 })).toBe(false)
    expect(isBoardOwner(null, { user: 7 })).toBe(false)
  })

  it('회원 수정 / 삭제 = 본인 또는 관리자', () => {
    expect(canManageUser({ id: 7, level: 1 }, { id: 7 })).toBe(true)
    expect(canManageUser({ id: 7, level: 1 }, { id: 8 })).toBe(false)
    expect(canManageUser({ id: 1, level: 3 }, { id: 8 })).toBe(true)
  })
})
