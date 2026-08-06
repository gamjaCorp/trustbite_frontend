import { auth } from '@/auth';
import { MyProfileView } from './_components';
import { getMyProfile } from '@/api/user/user';
import { getGrades } from '@/api/grade/grade';

// 내 프로필 페이지 — 등급·점수·설정 메뉴
export default async function MyProfilePage() {
  const [session, profile, grades] = await Promise.all([
    auth(),
    getMyProfile().catch(() => null),
    getGrades().catch(() => null),
  ]);

  if (!profile || !grades) {
    return (
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <p className="text-title-2 text-foreground">프로필을 불러오지 못했어요</p>
        <p className="text-body-2 text-muted-foreground mt-2">
          로그인 상태와 네트워크 연결을 확인한 뒤 새로고침해 주세요.
        </p>
      </div>
    );
  }

  return (
    <MyProfileView
      profile={profile}
      sessionName={session?.user?.name ?? undefined}
      sessionImage={session?.user?.image ?? undefined}
      grades={grades}
    />
  );
}
