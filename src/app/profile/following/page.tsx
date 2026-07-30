import { FollowListView } from '@/components/features/follow/index';
import { getMyProfile } from '@/api/user/user';
import { auth } from '@/auth';
import { getFollowings } from '@/api/follow/follow';

// 내 팔로잉 목록 페이지
export default async function MyFollowingPage() {
  const session = await auth();

  const followings = await getFollowings(Number(session?.user.id));

  if (!followings) return null;

  return (
    <FollowListView
      mode="self"
      myId={String(session?.user.id)}
      initialTab="following"
      basePath="/profile"
      following={followings}
    />
  );
}
