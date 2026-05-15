// TODO: 1차 MVP 제외 — NextAuth 통합 후 제거
'use client';

import { useAuthMock } from '@/stores/auth-mock-store';

// 개발 환경에서 비로그인/로그인 상태를 토글하는 플로팅 버튼
export function AuthMockToggle() {
  if (process.env.NODE_ENV !== 'development') return null;

  return <AuthMockToggleInner />;
}

function AuthMockToggleInner() {
  const { isAuthed, toggle } = useAuthMock();

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-lg transition-opacity hover:opacity-80"
    >
      <span className={isAuthed ? 'text-green-400' : 'text-red-400'}>●</span>
      {isAuthed ? '로그인 ON' : '로그인 OFF'}
    </button>
  );
}
