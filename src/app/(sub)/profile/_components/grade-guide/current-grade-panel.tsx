import { GradeIcon } from '@/components/common/trust/grade-icon';
import { StatCell } from '@/components/common/display/stat-cell';
import { cn } from '@/lib/utils';
import { GradeLevelDef } from '@/lib/domain/grade-levels';

interface Props {
  myGradeData: GradeLevelDef;
  reviewCount: number;
  trustScore: number;
}

// 현재 등급 패널 — 등급 아이콘·이름·현재 리뷰 수·신뢰도 수치 표시
export function CurrentGradePanel({ myGradeData, reviewCount, trustScore }: Props) {
  return (
    <div className="px-8 py-6 flex flex-col gap-4">
      <p className="text-label-2 text-muted-foreground">현재 등급</p>

      <div className="flex flex-col items-center gap-3 py-2">
        <GradeIcon name={myGradeData.name} size="lg" />
        <div className="text-center">
          <p className="text-label-3 text-muted-foreground mb-1">Lv.{myGradeData.rank}</p>
          <p className={cn('text-title-1', myGradeData.toneClass.text)}>{myGradeData.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <StatCell
          size="sm"
          label="리뷰"
          value={<StatValue value={reviewCount} unit="개" />}
          className="text-center"
        />
        <StatCell
          size="sm"
          label="신뢰도"
          value={<StatValue value={trustScore} unit="%" />}
          className="text-center"
        />
      </div>
    </div>
  );
}

// 숫자 값 + 단위(개·%)
function StatValue({ value, unit }: { value: number; unit: string }) {
  return (
    <>
      {value}
      <span className="text-caption-2 text-muted-foreground font-sans"> {unit}</span>
    </>
  );
}
