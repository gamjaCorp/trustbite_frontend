// 팔로워·팔로잉 탭 + 목록 컨테이너 — 본인/타 유저 공용 (server component)
import type { FollowTabKey, FollowedUser } from '@/types/follow';

import { FollowEmpty } from './follow-empty';
import { FollowTabs } from './follow-tabs';
import { FollowUserRow } from './follow-user-row';
import { PageResponse } from '@/types/common';

interface Props {
  mode: 'self' | 'other';
  myId: string; // 본인 row에 팔로우 버튼을 숨기기 위해 상위에서 주입
  subjectName?: string;
  initialTab: FollowTabKey;
  basePath: string;
  followers?: PageResponse<FollowedUser>;
  following?: PageResponse<FollowedUser>;
}

// 팔로워·팔로잉 탭 단일 패널 — 빈 상태 or FollowUserRow 목록
function FollowTabPanel({
  tab,
  mode,
  subjectName,
  myId,
  users,
}: {
  tab: FollowTabKey;
  mode: 'self' | 'other';
  subjectName: string;
  myId: string;
  users: FollowedUser[];
}) {
  if (users.length === 0) {
    return <FollowEmpty mode={mode} tab={tab} subjectName={subjectName} />;
  }
  return (
    <ul>
      {users.map((user) => (
        <FollowUserRow
          key={user.userId}
          user={user}
          hideFollowAction={String(user.userId) === myId}
        />
      ))}
    </ul>
  );
}

// 팔로워·팔로잉 목록 뷰 — self/other 모드로 탭 전환 제공
export function FollowListView({
  mode,
  myId,
  subjectName,
  initialTab,
  basePath,
  followers,
  following,
}: Props) {
  const title =
    mode === 'self'
      ? initialTab === 'followers'
        ? '내 팔로워'
        : '내 팔로잉'
      : initialTab === 'followers'
        ? `${subjectName}님의 팔로워`
        : `${subjectName}님의 팔로잉`;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="px-8 pt-8">
        <h1 className="text-title-1 text-foreground">{title}</h1>
      </div>

      <FollowTabs
        initialTab={initialTab}
        basePath={basePath}
        followersCount={followers?.totalElements ?? 0}
        followingCount={following?.totalElements ?? 0}
        followersPanel={
          <FollowTabPanel
            tab="followers"
            mode={mode}
            subjectName={subjectName ?? ''}
            myId={myId}
            users={followers?.content ?? []}
          />
        }
        followingPanel={
          <FollowTabPanel
            tab="following"
            mode={mode}
            subjectName={subjectName ?? ''}
            myId={myId}
            users={following?.content ?? []}
          />
        }
      />
    </div>
  );
}
