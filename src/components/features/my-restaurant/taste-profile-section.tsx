'use client';

import { useMemo } from 'react';
import { Sparkles, Utensils, MapPin, Users, Repeat, type LucideIcon } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Category, MyRestaurantEntry } from '@/types/restaurant';
import { CATEGORY_TEXT_STYLE } from '@/lib/category';
import { cn } from '@/lib/utils';

interface Props {
  entries: MyRestaurantEntry[];
  subjectName?: string;
  aiPersonaText?: string;
  reviewCount?: number;
  variant?: 'shadow' | 'bordered';
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  main: string;
  mainClass?: string;
  count?: number;
  unit?: string;
  sub?: string;
}

interface RadarTickProps {
  x?: string | number;
  y?: string | number;
  payload?: { value: string };
  textAnchor?: string;
  [key: string]: unknown;
}

// 미식 성향 통계 셀 — 섹션 내부 전용 (카드 스타일 없음)
function StatCard({ icon: Icon, label, main, mainClass, count, unit, sub }: StatCardProps) {
  return (
    <div className="space-y-2">
      <p className="text-body-2 text-muted-foreground flex items-center gap-1.5">
        <Icon className="w-4 h-4" />
        {label}
      </p>
      <p className={`text-headline-2 leading-tight ${mainClass ?? 'text-foreground'}`}>
        {main}
        {count !== undefined && (
          <span className="text-body-3 text-muted-foreground font-normal ml-1">
            · {count}{unit}
          </span>
        )}
      </p>
      {sub && <p className="text-body-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function avg(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// 레이더 최고·최저 축을 바탕으로 인사이트 한 줄 텍스트 생성
function buildInsightBadge(data: { subject: string; score: number }[]): string | null {
  if (data.length < 2) return null;
  const sorted = [...data].sort((a, b) => b.score - a.score);
  const high = sorted[0];
  const low = sorted[sorted.length - 1];
  if (high.score === low.score) return null;
  const highLabel: Record<string, string> = { 맛: '맛 기준 높음', 가성비: '가성비 중시', 분위기: '분위기 중시' };
  const lowLabel: Record<string, string> = { 맛: '맛 덜 까다로움', 가성비: '가성비 덜 따짐', 분위기: '분위기 신경 덜 씀' };
  return `${highLabel[high.subject] ?? high.subject} · ${lowLabel[low.subject] ?? low.subject}`;
}

// 나의 미식 성향 분석 섹션 — PRD §8.6 레이더 차트(맛/가성비/분위기) + §12.1 AI 취향 요약 4카드
export function TasteProfileSection({ entries, subjectName, aiPersonaText, reviewCount, variant = 'shadow' }: Props) {
  const radarData = useMemo(() => {
    if (entries.length === 0) return [];
    return [
      { subject: '맛',     score: +avg(entries.map((e) => e.scores.taste)).toFixed(1) },
      { subject: '가성비', score: +avg(entries.map((e) => e.scores.value)).toFixed(1) },
      { subject: '분위기', score: +avg(entries.map((e) => e.scores.vibe)).toFixed(1) },
    ];
  }, [entries]);

  const topCategories = useMemo(() => {
    const map = new Map<Category, number>();
    entries.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + 1));
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));
  }, [entries]);

  const topRegions = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => map.set(e.region, (map.get(e.region) ?? 0) + e.visitCount));
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));
  }, [entries]);

  const topContexts = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => {
      if (e.myLatestScene) map.set(e.myLatestScene, (map.get(e.myLatestScene) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));
  }, [entries]);

  // visitCount > 1인 장소 비율로 단골형/탐험형 판단
  const revisitStats = useMemo(() => {
    const revisited = entries.filter((e) => e.visitCount > 1).length;
    const total = entries.length;
    const pct = total > 0 ? Math.round((revisited / total) * 100) : 0;
    return { pct, revisited, total, label: pct >= 50 ? '단골형 성향' : '탐험형 성향' };
  }, [entries]);

  const insightBadge = useMemo(() => buildInsightBadge(radarData), [radarData]);

  const basisCount = reviewCount ?? entries.length;

  // 레이더 축 라벨에 점수를 함께 표기 — "맛 (4.5)"
  const renderRadarTick = ({ x = 0, y = 0, payload, textAnchor }: RadarTickProps) => {
    const entry = radarData.find((d) => d.subject === payload?.value);
    return (
      <text
        x={Number(x)}
        y={Number(y)}
        dy={4}
        textAnchor={textAnchor as 'start' | 'middle' | 'end' | 'inherit' | undefined}
        fill="var(--muted-foreground)"
        fontSize={12}
      >
        {payload?.value} ({entry?.score ?? 0})
      </text>
    );
  };

  if (entries.length === 0) return null;

  return (
    <section>
      <div className={cn('bg-card rounded-2xl overflow-hidden', variant === 'bordered' ? 'border border-border' : 'shadow-card')}>
        {/* 헤더 — 박스 내부 상단 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-headline-3 text-foreground flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            {subjectName ? `${subjectName}님의` : '나의'} 미식 성향
          </h2>
          <span className="text-body-3 text-muted-foreground">리뷰 {basisCount}개 기준</span>
        </div>

        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-border">
          {/* 왼쪽: 3축 레이더 + 인사이트 텍스트 — 우측 stat 그리드보다 좁게(40%) */}
          <div className="sm:basis-2/5 sm:flex-none p-5 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} margin={{ top: 16, right: 28, bottom: 4, left: 28 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={renderRadarTick}
                />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: 'var(--primary)', strokeOpacity: 0.3 }}
                  contentStyle={{
                    background: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: 12,
                    color: 'var(--popover-foreground)',
                  }}
                  formatter={(value) => [`${value}점`, '']}
                />
                <Radar
                  dataKey="score"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.25}
                  isAnimationActive
                />
              </RadarChart>
            </ResponsiveContainer>
            {insightBadge && (
              <p className="text-body-3 text-muted-foreground text-center -mt-3">{insightBadge}</p>
            )}
          </div>

          {/* 오른쪽: 2×2 통계 셀 그리드 — PRD §12.1 AI 취향 요약 입력값
              점선 구분선은 각 셀에 position-based border로 부여 (행 높이 가변 대응) */}
          <div className="flex-1 p-5 grid grid-cols-2 content-start">
            <div className="pr-4 pb-3.5 border-r border-b border-dashed border-border/50">
              <StatCard
                icon={Utensils}
                label="자주 먹는 카테고리"
                main={topCategories[0]?.label ?? '—'}
                mainClass={topCategories[0] ? CATEGORY_TEXT_STYLE[topCategories[0].label] : 'text-foreground'}
                count={topCategories[0]?.count}
                unit="번"
                sub={topCategories.slice(1).map(({ label, count }) => `${label} ${count}`).join(' · ') || undefined}
              />
            </div>
            <div className="pl-4 pb-3.5 border-b border-dashed border-border/50">
              <StatCard
                icon={MapPin}
                label="자주 가는 지역"
                main={topRegions[0]?.label ?? '—'}
                count={topRegions[0]?.count}
                unit="번"
                sub={topRegions.slice(1).map(({ label, count }) => `${label} ${count}`).join(' · ') || undefined}
              />
            </div>
            <div className="pr-4 pt-3.5 border-r border-dashed border-border/50">
              <StatCard
                icon={Users}
                label="주로 가는 상황"
                main={topContexts[0]?.label ?? '—'}
                count={topContexts[0]?.count}
                unit="번"
                sub={topContexts.slice(1).map(({ label, count }) => `${label} ${count}`).join(' · ') || undefined}
              />
            </div>
            <div className="pl-4 pt-3.5">
              <StatCard
                icon={Repeat}
                label="재방문 패턴"
                main={`${revisitStats.pct}%`}
                mainClass={revisitStats.pct >= 50 ? 'text-primary' : 'text-info'}
                sub={`${revisitStats.revisited}/${revisitStats.total}곳 · ${revisitStats.label}`}
              />
            </div>
          </div>
        </div>

        {/* 하단: AI 분석 패널 */}
        <div className="border-t border-border px-5 py-5 bg-gradient-to-br from-primary-subtle via-primary-subtle/40 to-info-subtle/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-label-2 text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI 미식 성향 분석
            </p>
            <span className="text-caption-2 text-muted-foreground">실시간 분석</span>
          </div>
          <p className="text-body-2 text-foreground leading-relaxed">
            {aiPersonaText ?? (
              <>
                가성비를 중시하면서도 맛에 대한 기준이 높은 <strong className="text-primary">실속파 미식가</strong>예요.
                한 번 마음에 든 곳은 꾸준히 재방문하는 단골형 성향도 보여요.
              </>
            )}
          </p>
          <p className="text-caption-2 text-muted-foreground">리뷰 {basisCount}개를 분석해 자동 생성한 결과예요</p>
        </div>
      </div>
    </section>
  );
}
