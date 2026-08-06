import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { FollowListView } from '../_components/index';
import { getFollowers, getFollowings } from '@/api/follow/follow';
import { getMyProfile, getUserProfile } from '@/api/user/user';
import type { FollowTabKey } from '@/types/follow';

// 팔로워·팔로잉 목록 페이지 — id가 'me'면 내 목록, 숫자면 해당 유저의 목록
export default async function FollowsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  const initialTab: FollowTabKey = tab === 'following' ? 'following' : 'followers';
  const isSelf = id === 'me';

  const fetchList = (userId: number) =>
    initialTab === 'following' ? getFollowings(userId) : getFollowers(userId);

  if (isSelf) {
    const session = await auth();
    const myId = Number(session?.user.id);

    const [profile, list] = await Promise.all([
      getMyProfile().catch(() => null),
      Number.isNaN(myId) ? Promise.resolve(null) : fetchList(myId).catch(() => null),
    ]);

    // 세션 없음·조회 실패 — 404가 아니라 안내 문구로 처리한다
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
        basePath="/follow/me"
        list={list}
        followersCount={profile.followerCount}
        followingCount={profile.followingCount}
      />
    );
  }

  const userId = Number(id);
  if (Number.isNaN(userId)) notFound();

  const [profile, list] = await Promise.all([getUserProfile(userId), fetchList(userId)]);
  if (!profile) notFound();
  if (!list) return null;

  return (
    <>
      <FollowListView
        mode="other"
        subjectName={profile.nickname}
        initialTab={initialTab}
        basePath={`/follow/${id}`}
        list={list}
        followersCount={profile.followerCount}
        followingCount={profile.followingCount}
      />
    </>
  );
}
