import { MyProfileView } from '@/components/features/my-profile/index';
import { getMyProfile } from '@/data/mock-my-profile';

export default function MyProfilePage() {
  const profile = getMyProfile();
  return <MyProfileView profile={profile} />;
}
