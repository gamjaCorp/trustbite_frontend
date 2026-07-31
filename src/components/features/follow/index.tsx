// 팔로워·팔로잉 탭 + 목록 컨테이너 — 본인/타 유저 공용 (server component)
import { auth } from '@/auth';
import type { FollowTabKey, FollowedUser } from '@/types/follow';

import { FollowEmpty } from './follow-empty';
import { FollowTabs } from './follow-tabs';
import { FollowUserRow } from './follow-user-row';
import { PageResponse } from '@/types/common';

interface Props {
  mode: 'self' | 'other';
  subjectName?: string;
  initialTab: FollowTabKey;
  basePath: string;
  list: PageResponse<FollowedUser>; // 현재 탭(initialTab)의 목록
  followersCount: number;
  followingCount: number;
}

// 팔로워·팔로잉 목록 뷰 — self/other 모드로 탭 전환 제공
export async function FollowListView({
  mode,
  subjectName,
  initialTab,
  basePath,
  list,
  followersCount,
  followingCount,
}: Props) {
  const session = await auth();
  const myId = session?.user.id !== undefined ? Number(session.user.id) : undefined;

  const title =
    mode === 'self'
      ? initialTab === 'followers'
        ? '내 팔로워'
        : '내 팔로잉'
      : initialTab === 'followers'
        ? `${subjectName}님의 팔로워`
        : `${subjectName}님의 팔로잉`;

  const users = list.content;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="px-8 pt-8">
        <h1 className="text-title-1 text-foreground">{title}</h1>
      </div>

      <FollowTabs
        initialTab={initialTab}
        basePath={basePath}
        followersCount={followersCount}
        followingCount={followingCount}
        panel={
          users.length === 0 ? (
            <FollowEmpty mode={mode} tab={initialTab} subjectName={subjectName ?? ''} />
          ) : (
            <ul>
              {users.map((user) => (
                <FollowUserRow
                  key={user.userId}
                  user={user}
                  hideFollowAction={user.userId === myId}
                />
              ))}
            </ul>
          )
        }
      />
    </div>
  );
}
