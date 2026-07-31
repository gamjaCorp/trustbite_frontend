import { notFound } from 'next/navigation';

import { BackHeader } from '@/components/common/layout/back-header';
import { FollowListView } from '@/components/features/follow/index';
import { getFollowers, getFollowings } from '@/api/follow/follow';
import { getUserProfile } from '@/api/user/user';
import type { FollowTabKey } from '@/types/follow';

// 타 유저 팔로워·팔로잉 목록 페이지
export default async function UserFollowsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const initialTab: FollowTabKey = tab === 'following' ? 'following' : 'followers';
  const userId = Number(id);

  const [profile, list] = await Promise.all([
    getUserProfile(userId),
    initialTab === 'following' ? getFollowings(userId) : getFollowers(userId),
  ]);

  if (!profile) notFound();
  if (!list) return null;

  return (
    <>
      <BackHeader />
      <FollowListView
        mode="other"
        subjectName={profile.nickname}
        initialTab={initialTab}
        basePath={`/user/${id}/follows`}
        list={list}
        followersCount={profile.followerCount}
        followingCount={profile.followingCount}
      />
    </>
  );
}
