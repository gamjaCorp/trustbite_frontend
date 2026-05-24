// 지역 랭킹 리스트 스켈레톤 — 재검색·초기 로딩 시 placeholder
import { Skeleton } from '@/components/ui/skeleton';

export function RegionRankSkeleton() {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="h-3.5 w-32" />
      </div>
      <ul className="border-y border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className={i > 0 ? 'border-t border-border' : ''}>
            <div className="flex items-center gap-3 pl-3 pr-3 py-4 sm:gap-4 sm:pl-4 sm:pr-4">
              <Skeleton className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl" />
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="hidden sm:flex shrink-0 flex-col items-end gap-1 px-3 sm:px-4">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-4 w-14 rounded-chip" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
