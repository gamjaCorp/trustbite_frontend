import { nameTolocalGrade } from '@/lib/domain/grade-levels';

import { GradeIcon } from './grade-icon';

interface Props {
  grade: string | null | undefined; // 서버 grade 이름 (예: 'COLLECTOR'). 없으면 '-'
  rank?: number; // 등급 사다리 순위(GET /api/grades). 없으면 Lv. 표기를 생략한다
}

// StatsStrip '등급' 칸 값 — Lv.순위 + 아이콘 + 라벨. 로컬에 매핑되는 등급이 없으면 '-'만 표시
export function GradeCellValue({ grade, rank }: Props) {
  const levelDef = grade ? nameTolocalGrade(grade) : undefined;
  if (!levelDef) return <>-</>;

  return (
    <span className={`flex items-center gap-1.5 ${levelDef.toneClass.text}`}>
      <GradeIcon name={levelDef.name} size="md" variant="inline" />
      {rank != null && `Lv.${rank}`}
      <span className="text-body-2 text-muted-foreground font-normal">{levelDef.label}</span>
    </span>
  );
}
