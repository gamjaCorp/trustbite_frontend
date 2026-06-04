import { auth } from '@/auth';
import { MyProfileView } from '@/components/features/profile/index';
import { getMyProfile } from '@/data/mock-my-profile';

// 내 프로필 페이지 — 등급·점수·설정 메뉴
export default async function MyProfilePage() {
  const [session, profile] = await Promise.all([auth(), Promise.resolve(getMyProfile())]);
  return (
    <MyProfileView
      profile={profile}
      sessionName={session?.user?.name ?? undefined}
      sessionImage={session?.user?.image ?? undefined}
    />
  );
}
