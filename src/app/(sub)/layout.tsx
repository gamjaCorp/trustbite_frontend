import { getSession } from '@/auth';
import { getMyProfile } from '@/api/user/user';
import { BackHeader } from '@/components/common/layout/back-header';

// 뒤로가기 헤더 그룹 — 상세·폼처럼 한 단계 들어간 페이지
export default async function SubLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // 온보딩 미완료 세션엔 프로필이 없다. 이 그룹엔 공개 페이지(가게 상세·타 유저 프로필)가
  // 있어 가드 없이 부르면 익명 방문마다 401 왕복이 생긴다.
  let me = null;
  if (session && !session.needsOnboarding) {
    me = await getMyProfile().catch(() => null);
  }

  return (
    <div className="header-h-sub">
      <BackHeader me={me} />
      <main className="min-h-[calc(100vh-var(--header-height))] bg-background">{children}</main>
    </div>
  );
}
