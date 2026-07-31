import { auth } from '@/auth';
import { FollowListView } from '@/components/features/follow/index';
import { getFollowers, getFollowings } from '@/api/follow/follow';
import { getMyProfile } from '@/api/user/user';
import type { FollowTabKey } from '@/types/follow';

// 내 팔로워·팔로잉 목록 페이지
export default async function MyFollowsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: FollowTabKey = tab === 'following' ? 'following' : 'followers';

  const session = await auth();
  const userId = Number(session?.user.id);

  const [profile, list] = await Promise.all([
    getMyProfile(),
    initialTab === 'following' ? getFollowings(userId) : getFollowers(userId),
  ]);

  if (!list) return null;

  return (
    <FollowListView
      mode="self"
      initialTab={initialTab}
      basePath="/profile/follows"
      list={list}
      followersCount={profile.followerCount}
      followingCount={profile.followingCount}
    />
  );
}
