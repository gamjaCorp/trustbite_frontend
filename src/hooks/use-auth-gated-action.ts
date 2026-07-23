'use client';

import { useState } from 'react';

import { useAuthStatus } from '@/hooks/use-auth-status';

interface Options {
  action: () => void; // 로그인 상태일 때 실행할 액션
  callbackPath: string; // 로그인 후 돌아올 경로
  description?: string; // LoginCtaDialog 설명 문구
}

// 비로그인 → LoginCtaDialog 표시, 로그인 → action 실행
// useState + isAuthed 체크 + LoginCtaDialog 패턴을 한 곳에 캡슐화
export function useAuthGatedAction({ action, callbackPath, description }: Options) {
  const [open, setOpen] = useState(false);
  const { isAuthed } = useAuthStatus();

  function trigger() {
    if (!isAuthed) { setOpen(true); return; }
    action();
  }

  const dialogProps = {
    open,
    onOpenChange: setOpen,
    callbackPath,
    description,
  };

  return { trigger, dialogProps, isAuthed };
}
