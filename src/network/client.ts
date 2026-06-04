'use client';

import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
import { ApiError, parseResponse } from './base';

// 클라이언트 fetch — 백엔드가 아닌 우리 Next /api 프록시를 상대경로로 호출한다.
// 토큰은 httpOnly 세션 쿠키로 자동 전송되므로 클라가 직접 다루지 않는다.
// 401이 오면 세션 만료로 보고 toast 안내 후 로그아웃한다.
export async function clientFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...((options?.headers as Record<string, string>) ?? {}) },
    ...options,
  });

  if (res.status === 401) {
    toast.error('세션이 만료되었어요. 다시 로그인해 주세요.');
    await signOut({ callbackUrl: '/signin' });
    throw new ApiError(401, 'UNAUTHENTICATED', '세션이 만료되었어요.');
  }

  return parseResponse<T>(res);
}
