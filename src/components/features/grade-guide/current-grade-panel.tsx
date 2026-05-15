import { getLevelDef } from '@/lib/grade-levels';
import type { GradeLevel } from '@/lib/grade-levels';

import { GradeIcon } from '@/components/common/grade-icon';

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
          <p className="text-title-1 text-foreground">{def.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="text-center">
          <p className="text-caption-1 text-muted-foreground mb-1">리뷰</p>
          <p className="font-numeric text-title-1 text-foreground">
            {reviewCount}
            <span className="text-caption-2 text-muted-foreground font-sans"> 개</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-caption-1 text-muted-foreground mb-1">신뢰도</p>
          <p className="font-numeric text-title-1 text-foreground">
            {trustScore}
            <span className="text-caption-2 text-muted-foreground font-sans"> %</span>
          </p>
        </div>
      </div>
    </div>
  );
}
