'use client';

// 로그아웃 행 — signOut 클라이언트 액션
import { signOut } from 'next-auth/react';

import { ProfileListRow } from './profile-list-row';

// 로그아웃 행 — 탭하면 signOut을 호출하는 설정 목록 행
export function LogoutRow() {
  return (
    <ProfileListRow
      label="로그아웃"
      tone="danger"
      onClick={() => signOut({ callbackUrl: '/signin' })}
    />
  );
}
