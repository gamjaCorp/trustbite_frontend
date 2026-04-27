import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export function ProfileSection({ title, children }: Props) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-muted-foreground px-1 mb-2">{title}</h2>
      <ul className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border">
        {children}
      </ul>
    </section>
  );
}
