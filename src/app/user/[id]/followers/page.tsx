import { notFound } from 'next/navigation';

import { BackHeader } from '@/components/common/layout/back-header';
import { FollowListView } from '@/components/features/follow/index';
import { getFollowers, getFollowing } from '@/data/mock-follow';
import { getUserProfile } from '@/data/mock-other-user';
import { getMyProfile } from '@/data/mock-my-profile';

export default async function UserFollowersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getUserProfile(id);
  if (!profile) notFound();
  const myId = getMyProfile().id;

  return (
    <>
      <BackHeader />
      <FollowListView
        mode="other"
        myId={myId}
        subjectName={profile.name}
        initialTab="followers"
        basePath={`/user/${id}`}
        followers={getFollowers(profile.id)}
        following={getFollowing(profile.id)}
      />
    </>
  );
}
