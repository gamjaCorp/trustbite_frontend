import { notFound } from 'next/navigation';

import { UserProfileView } from './_components';
import { getUserProfile } from '@/api/user/user';

export default async function userProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getUserProfile(Number(id));

  if (!profile) notFound();

  return (
    <>
      <UserProfileView profile={profile} />
    </>
  );
}
