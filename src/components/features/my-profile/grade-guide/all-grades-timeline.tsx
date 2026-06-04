import { GradeIcon } from '@/components/common/trust/grade-icon';
import { GRADE_LEVELS } from '@/lib/domain/grade-levels';
import type { GradeLevel } from '@/lib/domain/grade-levels';
import { cn } from '@/lib/utils';

interface Props {
  currentLevel: GradeLevel;
}

// chip-slot(24px) + gap(4px) + icon-center(24px)
const CONNECTOR_TOP_PX = 52;

// 전체 등급 타임라인 — Lv1~6 단계를 수직으로 나열하고 현재 등급 강조
export function AllGradesTimeline({ currentLevel }: Props) {
  const nextLevel = currentLevel < 6 ? ((currentLevel + 1) as GradeLevel) : null;

  return (
    <div className="pt-6 pb-14">
      <p className="px-8 text-label-2 text-muted-foreground mb-5">전체 등급</p>
      <div className="overflow-x-auto scrollbar-hide">
        <ol className="grid grid-cols-6 px-8 min-w-[560px] sm:min-w-0">
          {GRADE_LEVELS.map((lvl, i) => {
            const isCurrent = lvl.level === currentLevel;
            const isNext = lvl.level === nextLevel;
            const isReached = lvl.level <= currentLevel;
            const connectorActive = isReached && i < GRADE_LEVELS.length - 1;
            const iconState = !isReached ? 'muted' : isNext ? 'next' : 'default';

            return (
              <li key={lvl.level} className="relative flex flex-col items-center text-center gap-1 px-0.5">
                {/* 칩 슬롯 — 항상 h-6(24px)으로 고정해 아이콘 수직 정렬 일치 */}
                <div className="h-6 flex items-center justify-center">
                  {isCurrent && (
                    <span className="rounded-chip bg-palette-green/15 text-palette-green px-1.5 py-0.5 text-label-3">
                      달성
                    </span>
                  )}
                  {isNext && (
                    <span className="rounded-chip bg-primary text-primary-foreground px-1.5 py-0.5 text-label-3 animate-pulse">
                      다음 목표
                    </span>
                  )}
                </div>

                {i < GRADE_LEVELS.length - 1 && (
                  <span
                    className={cn(
                      'absolute h-px left-[calc(50%+24px)] right-[calc(-50%+24px)]',
                      connectorActive ? 'bg-primary' : 'bg-border',
                    )}
                    style={{ top: CONNECTOR_TOP_PX }}
                  />
                )}

                <GradeIcon level={lvl.level} size="md" state={iconState} className="relative z-10" />

                <span className="text-label-3 text-muted-foreground mt-1">Lv.{lvl.level}</span>

                <span
                  className={cn(
                    'text-title-3',
                    isReached ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {lvl.label}
                </span>

                <div className="mt-1 flex flex-col items-center gap-0.5">
                  {lvl.reviewMin === 0 && lvl.trustMin === 0 ? (
                    <span className="text-caption-2 text-muted-foreground">기본 등급</span>
                  ) : (
                    <>
                      <span className="text-caption-2 text-muted-foreground">
                        리뷰 <span className="">{lvl.reviewMin}</span>개
                      </span>
                      <span className="text-caption-2 text-muted-foreground">
                        신뢰도 <span className="">{lvl.trustMin}</span>%
                      </span>
                    </>
                  )}
                </div>

              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
