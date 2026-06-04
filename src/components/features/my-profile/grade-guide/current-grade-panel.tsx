import { getLevelDef } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';

import { GradeIcon } from '@/components/common/grade-icon';
import { StatCell } from '@/components/common/stat-cell';
import { cn } from '@/lib/utils';

interface Props {
  level: GradeLevel;
  reviewCount: number;
  trustScore: number;
}

export function CurrentGradePanel({ level, reviewCount, trustScore }: Props) {
  const def = getLevelDef(level);

  return (
    <div className="px-8 py-6 flex flex-col gap-4">
      <p className="text-label-2 text-muted-foreground">현재 등급</p>

      <div className="flex flex-col items-center gap-3 py-2">
        <GradeIcon level={level} size="lg" />
        <div className="text-center">
          <p className="text-label-3 text-muted-foreground mb-1">Lv.{level}</p>
          <p className={cn('text-title-1', def.toneClass.text)}>{def.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <StatCell
          size="sm"
          label="리뷰"
          value={<>{reviewCount}<span className="text-caption-2 text-muted-foreground font-sans"> 개</span></>}
          className="text-center"
        />
        <StatCell
          size="sm"
          label="신뢰도"
          value={<>{trustScore}<span className="text-caption-2 text-muted-foreground font-sans"> %</span></>}
          className="text-center"
        />
      </div>
    </div>
  );
}
