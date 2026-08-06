import { Header } from '@/components/common/layout/header/index';

// 글로벌 헤더 그룹
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="header-h-main">
      <Header />
      <main className="min-h-[calc(100vh-var(--header-height))] bg-background">{children}</main>
    </div>
  );
}
