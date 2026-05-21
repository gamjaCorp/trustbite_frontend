// TODO: 1차 MVP 제외 — NextAuth 통합 후 제거
'use client';

import { useAuthMock } from '@/stores/auth-mock-store';

// 로그인/비로그인 상태를 토글하는 플로팅 버튼 (임시 데모용)
export function AuthMockToggle() {
  return <AuthMockToggleInner />;
}

function AuthMockToggleInner() {
  const { isAuthed, toggle } = useAuthMock();

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-label-3 text-background shadow-lg transition-opacity hover:opacity-80"
    >
      <span className={isAuthed ? 'text-success' : 'text-error'}>●</span>
      {isAuthed ? '로그인 ON' : '로그인 OFF'}
    </button>
  );
}
