import { MyProfileView } from '@/components/features/my-profile/index';
import { getMyProfile } from '@/data/mock-my-profile';

// 내 프로필 페이지 — 등급·점수·설정 메뉴
export default function MyProfilePage() {
  const profile = getMyProfile();
  return <MyProfileView profile={profile} />;
}
