import type { ReactNode } from 'react';

// 폼 섹션의 라벨·힌트·필수 표시를 감싸는 레이아웃 그룹
export function FieldGroup({
  label,
  hint,
  required,
  labelRight,
  children,
}: {
  label: string;
  hint?: ReactNode;
  required?: boolean;
  labelRight?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-title-2 text-foreground">
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          )}
        </span>
        {hint && (
          <span className="text-caption-2 text-muted-foreground flex items-center gap-1">
            · {hint}
          </span>
        )}
        {labelRight && (
          <span className="ml-auto text-caption-2 text-muted-foreground">{labelRight}</span>
        )}
      </div>
      {children}
    </div>
  );
}
