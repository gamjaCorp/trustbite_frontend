import { notFound } from 'next/navigation';

import { BackHeader } from '@/components/features/user-profile/back-header';
import { UserProfileView } from '@/components/features/user-profile/user-profile-view';
import { getUserProfile } from '@/data/mock-other-user';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getUserProfile(id);
  if (!profile) notFound();

  return (
    <>
      <BackHeader />
      <UserProfileView profile={profile} />
    </>
  );
}
