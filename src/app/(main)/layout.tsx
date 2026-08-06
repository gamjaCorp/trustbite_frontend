import { Header } from '@/components/common/layout/header/index';

// 글로벌 헤더 그룹 — 로고 + NavTabs를 쓰는 최상위 탐색 진입점(/ · /my-places)
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="header-h-main">
      <Header />
      <main className="min-h-[calc(100vh-var(--header-height))] bg-background">{children}</main>
    </div>
  );
}
