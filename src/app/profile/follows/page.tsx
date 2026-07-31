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
    getMyProfile().catch(() => null),
    Number.isNaN(userId)
      ? Promise.resolve(null)
      : (initialTab === 'following' ? getFollowings(userId) : getFollowers(userId)).catch(
          () => null,
        ),
  ]);

  if (!profile || !list) {
    return (
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <p className="text-title-2 text-foreground">목록을 불러오지 못했어요</p>
        <p className="text-body-2 text-muted-foreground mt-2">
          로그인 상태와 네트워크 연결을 확인한 뒤 새로고침해 주세요.
        </p>
      </div>
    );
  }

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
