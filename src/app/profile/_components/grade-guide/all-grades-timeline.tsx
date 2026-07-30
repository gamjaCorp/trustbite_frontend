'use client';

import { useEffect, useRef } from 'react';
import type { Ref } from 'react';

import { GradeIcon } from '@/components/common/trust/grade-icon';
import { mergeGradeLadder, type GradeLevelDef } from '@/lib/domain/grade-levels';
import { cn } from '@/lib/utils';
import type { Grade } from '@/types/grade';

interface Props {
  currentLevel: number;
  grades: Grade[];
}

const CONNECTOR_TOP_PX = 52;

// 현재 등급이 모바일 가로 스크롤 뷰의 중앙에 오도록 컨테이너 스크롤 위치를 계산
// scrollIntoView 대신 scrollLeft 직접 계산 — 페이지 세로 스크롤 점프 방지
function useCenterCurrentLevel(currentLevel: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const current = currentRef.current;
    if (!container || !current) return;
    const offset = current.offsetLeft - container.offsetWidth / 2 + current.offsetWidth / 2;
    container.scrollLeft = Math.max(0, offset);
  }, [currentLevel]);

  return { containerRef, currentRef };
}

interface BadgeProps {
  isCurrent: boolean; // 이미 달성한 현재 등급인지
  isNext: boolean; // 다음 목표 등급인지
}

// 달성/다음 목표 칩 — 항상 h-6(24px) 슬롯으로 고정해 아이콘 수직 정렬 일치
function TimelineBadge({ isCurrent, isNext }: BadgeProps) {
  return (
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
  );
}

// 등급 달성 조건 — 기본 등급이면 안내 문구, 그 외에는 리뷰·신뢰도 기준치 표시
function TimelineRequirement({ grade }: { grade: GradeLevelDef }) {
  if (grade.reviewMin === 0 && grade.trustMin === 0) {
    return <span className="text-caption-2 text-muted-foreground">기본 등급</span>;
  }

  return (
    <>
      <span className="text-caption-2 text-muted-foreground">리뷰 {grade.reviewMin}개</span>
      <span className="text-caption-2 text-muted-foreground">신뢰도 {grade.trustMin}%</span>
    </>
  );
}

interface TimelineItemProps {
  grade: GradeLevelDef;
  currentLevel: number;
  nextLevel: number | null;
  isLast: boolean; // 마지막 칸이면 연결선을 그리지 않음
  itemRef?: Ref<HTMLLIElement>; // 현재 등급 칸에만 스크롤 중앙 정렬용 ref 연결
}

// 타임라인 한 칸 — 칩·연결선·아이콘·라벨·달성 조건을 세로로 쌓아 표시
function TimelineItem({ grade, currentLevel, nextLevel, isLast, itemRef }: TimelineItemProps) {
  const isCurrent = grade.rank === currentLevel;
  const isNext = grade.rank === nextLevel;
  const isReached = grade.rank <= currentLevel;
  const connectorActive = isReached && !isLast;
  const iconState = !isReached ? 'muted' : isNext ? 'next' : 'default';

  return (
    <li ref={itemRef} className="relative flex flex-col items-center text-center gap-1 px-0.5">
      <TimelineBadge isCurrent={isCurrent} isNext={isNext} />

      {!isLast && (
        <span
          className={cn(
            'absolute h-px left-[calc(50%+24px)] right-[calc(-50%+24px)]',
            connectorActive ? 'bg-primary' : 'bg-border',
          )}
          style={{ top: CONNECTOR_TOP_PX }}
        />
      )}

      <GradeIcon name={grade.name} size="md" state={iconState} className="relative z-10" />

      <span className="text-label-3 text-muted-foreground mt-1">Lv.{grade.rank}</span>

      <span className={cn('text-title-3', isReached ? 'text-foreground' : 'text-muted-foreground')}>
        {grade.label}
      </span>

      <div className="mt-1 flex flex-col items-center gap-0.5">
        <TimelineRequirement grade={grade} />
      </div>
    </li>
  );
}

// 전체 등급 타임라인 — Lv1~6 단계를 수직으로 나열하고 현재 등급 강조
export function AllGradesTimeline({ currentLevel, grades }: Props) {
  const nextLevel = currentLevel < 6 ? ((currentLevel + 1) as number) : null;
  const { containerRef, currentRef } = useCenterCurrentLevel(currentLevel);
  const mergedGrades = mergeGradeLadder(grades);

  return (
    <div className="pt-6 pb-14">
      <p className="px-8 text-label-2 text-muted-foreground mb-5">전체 등급</p>
      <div className="relative">
        <div ref={containerRef} className="overflow-x-auto scrollbar-hide">
          <ol className="grid grid-cols-6 px-8 min-w-[560px] sm:min-w-0">
            {mergedGrades.map((grade, i) => (
              <TimelineItem
                key={grade.rank}
                grade={grade}
                currentLevel={currentLevel}
                nextLevel={nextLevel}
                isLast={i === mergedGrades.length - 1}
                itemRef={grade.rank === currentLevel ? currentRef : undefined}
              />
            ))}
          </ol>
        </div>
        {/* 모바일에서 가로 스크롤 가능 여부를 암시하는 우측 fade */}
        <div className="sm:hidden absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
