import { NotFoundView } from '@/components/common/layout/not-found-view';

// 매칭되지 않은 주소의 전역 404 — 루트 레이아웃엔 헤더도 <main>도 없어 여기서 직접 준다
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <NotFoundView />
    </main>
  );
}
