import { NotFoundView } from '@/components/common/layout/not-found-view';

// (sub) 그룹의 notFound() 404 — 레이아웃이 BackHeader와 <main>을 이미 주므로 정렬만 맡는다
export default function SubNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] items-center justify-center">
      <NotFoundView />
    </div>
  );
}
