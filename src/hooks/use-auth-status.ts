'use client';

import { useSession } from 'next-auth/react';

// 로그인 상태·로딩 여부·유저 정보를 묶어 반환하는 훅
export function useAuthStatus() {
  const { data: session, status } = useSession();
  return {
    isAuthed: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user ?? null,
  };
}
