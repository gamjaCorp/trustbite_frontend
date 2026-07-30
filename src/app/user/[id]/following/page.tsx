import { notFound } from 'next/navigation';

import { BackHeader } from '@/components/common/layout/back-header';
import { FollowListView } from '@/components/features/follow/index';
import { getFollowers, getFollowing } from '@/data/mock-follow';
import { getMyProfile, getUserProfile } from '@/api/user/user';

export default async function UserFollowingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getUserProfile(Number(id));
  if (!profile) notFound();
  const myId = String((await getMyProfile()).userId);

  return (
    <>
      <BackHeader />
      <FollowListView
        mode="other"
        myId={myId}
        subjectName={profile.nickname}
        initialTab="following"
        basePath={`/user/${id}`}
        followers={getFollowers(String(profile.userId))}
        following={getFollowing(String(profile.userId))}
      />
    </>
  );
}
