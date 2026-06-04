import 'server-only';

import { auth } from '@/auth';
import { API_BASE_URL, parseResponse } from './base';

// 공개 데이터용 서버 fetch — 토큰 없음. Next 데이터 캐시 옵션(tags, revalidate)을 그대로 통과시킨다.
export async function publicFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...((options?.headers as Record<string, string>) ?? {}) },
    ...options,
  });
  return parseResponse<T>(res);
}

// 로그인 사용자 데이터용 서버 fetch — auth()로 토큰을 읽어 Bearer로 붙인다. 캐시는 끈다(no-store).
// 주의: accessToken은 W4에서 jwt 콜백이 채운다. 골격 단계에선 항상 undefined → 헤더 미부착이 정상.
export async function authedFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const session = await auth();
  const extraHeaders: Record<string, string> = session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
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
