import { FollowListView } from '@/components/features/follow/index';
import { auth } from '@/auth';
import { getFollowers } from '@/api/follow/follow';

// 내 팔로워 목록 페이지
export default async function MyFollowersPage() {
  const session = await auth();

  const followers = await getFollowers(Number(session?.user.id));

  if (!followers) return null;

  return (
    <FollowListView
      mode="self"
      myId={String(session?.user.id)}
      initialTab="followers"
      basePath="/profile"
      followers={followers}
    />
  );
}
