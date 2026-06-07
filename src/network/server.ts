import 'server-only';

import { API_BASE_URL, parseResponse } from './base';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

// 공개 데이터용 서버 fetch — 토큰 없음
export async function publicFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) ?? {}),
    },
    ...options,
  });
  return parseResponse<T>(res);
}

// 로그인 사용자 데이터용 서버 fetch
export async function authedFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken({
    req: { headers: await headers() },
    secret: process.env.AUTH_SECRET,
  });
  const extraHeaders: Record<string, string> = token?.accessToken
    ? { Authorization: `Bearer ${token.accessToken}` }
    : {};

  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
      ...((options?.headers as Record<string, string>) ?? {}),
    },
    ...options,
  });
  return parseResponse<T>(res);
}
