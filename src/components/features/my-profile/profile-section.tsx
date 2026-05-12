import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export function ProfileSection({ title, children }: Props) {
  return (
    <div>
      <h2 className="text-label-2 text-muted-foreground px-8 pt-5 pb-2">{title}</h2>
      <ul className="divide-y divide-border">{children}</ul>
    </div>
  );
}
