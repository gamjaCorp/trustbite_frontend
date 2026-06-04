import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

// 프로필 내 그룹 섹션 — 제목 + 구분선으로 감싸는 목록 영역
export function ProfileSection({ title, children }: Props) {
  return (
    <div>
      <h2 className="text-label-2 text-muted-foreground px-8 pt-5 pb-2">{title}</h2>
      <ul className="divide-y divide-border">{children}</ul>
    </div>
  );
}
