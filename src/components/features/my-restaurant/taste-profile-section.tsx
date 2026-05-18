'use client';

import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { CATEGORY_STYLE } from '@/lib/category';
import { Category, MyRestaurantEntry } from '@/types/restaurant';

interface Props {
  entries: MyRestaurantEntry[];
  subjectName?: string;
  aiPersonaText?: string;
}

function avg(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function TasteProfileSection({ entries, subjectName, aiPersonaText }: Props) {
  const radarData = useMemo(() => {
    if (entries.length === 0) return [];
    return [
      { subject: '맛',     score: Math.round(avg(entries.map((e) => e.scores.taste))            / 5 * 100) },
      { subject: '재방문', score: Math.round(avg(entries.map((e) => Math.min(e.visitCount, 5))) / 5 * 100) },
      { subject: '가성비', score: Math.round(avg(entries.map((e) => e.scores.value))            / 5 * 100) },
      { subject: '분위기', score: Math.round(avg(entries.map((e) => e.scores.vibe))             / 5 * 100) },
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

  if (entries.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-headline-3 text-foreground">
        {subjectName ? `${subjectName}님의` : '나의'} 미식 성향
      </h2>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        {/* 상단: 점수 바 | 카테고리 + 지역 */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
          {/* 왼쪽: 레이더 차트 */}
          <div className="flex-1 p-2">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
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
          </div>

          {/* 오른쪽: 카테고리 + 지역 */}
          <div className="flex-1 p-5 space-y-4">
            <div className="space-y-2">
              <p className="text-label-3 text-muted-foreground">자주 먹는 카테고리</p>
              <div className="flex flex-wrap gap-1.5">
                {topCategories.map(({ label, count }) => (
                  <span
                    key={label}
                    className={cn('text-label-3 rounded-chip px-2.5 py-1 font-medium', CATEGORY_STYLE[label as Category])}
                  >
                    {label} ({count})
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-label-3 text-muted-foreground">주로 찾는 지역</p>
              <div className="flex flex-wrap gap-1.5">
                {topRegions.map(({ label, count }) => (
                  <span
                    key={label}
                    className="text-label-3 rounded-chip px-2.5 py-1 font-medium bg-muted text-muted-foreground"
                  >
                    {label} ({count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단: AI 분석 풀 너비 */}
        <div className="border-t border-border px-5 py-4 bg-primary/5 space-y-1">
          <p className="text-label-3 text-primary font-semibold">AI 미식 성향 분석</p>
          <p className="text-sm text-foreground leading-relaxed">
            {aiPersonaText ?? (
              <>
                가성비를 중시하면서도 맛에 대한 기준이 높은 <strong>실속파 미식가</strong>예요.
                한 번 마음에 든 곳은 꾸준히 재방문하는 단골형 성향도 보여요.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
