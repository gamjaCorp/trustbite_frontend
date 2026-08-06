// 헤더 없는 그룹 — 로그인·온보딩처럼 화면 전체를 쓰는 진입 플로우.
// 헤더가 없으므로 --header-height를 참조하지 않는다 (하위 페이지는 min-h-screen 사용)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="bg-background">{children}</main>;
}
