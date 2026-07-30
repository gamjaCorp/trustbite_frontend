import { notFound } from 'next/navigation';

import { BackHeader } from '@/components/common/layout/back-header';
import { UserProfileView } from './_components';
import { getUserProfile } from '@/api/user/user';

export default async function userProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getUserProfile(Number(id));

  console.log(profile);

  if (!profile) notFound();

  return (
    <>
      {/* <BackHeader /> */}
      <UserProfileView profile={profile} />
    </>
  );
}
