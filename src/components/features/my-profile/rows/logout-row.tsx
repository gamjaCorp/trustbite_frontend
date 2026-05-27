'use client';

// 로그아웃 행 — signOut 클라이언트 액션
import { signOut } from 'next-auth/react';

import { ProfileListRow } from './profile-list-row';

export function LogoutRow() {
  return (
    <ProfileListRow
      label="로그아웃"
      tone="danger"
      onClick={() => signOut({ callbackUrl: '/signin' })}
    />
  );
}
