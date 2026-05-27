// 씬 태그 칩 묶음 — rounded-chip bg-muted 스타일로 inline 표시
import { cn } from '@/lib/utils';

interface Props {
  tags: string[];
  className?: string;
}

export function SceneTagsRow({ tags, className }: Props) {
  if (!tags.length) return null;
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-chip bg-muted px-2 py-0.5 text-label-3 text-muted-foreground"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
