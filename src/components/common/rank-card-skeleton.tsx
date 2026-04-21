import { Skeleton } from '@/components/ui/skeleton';

export function RankCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-12 rounded-chip" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20 rounded-chip" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function RankCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RankCardSkeleton key={i} />
      ))}
    </div>
  );
}
