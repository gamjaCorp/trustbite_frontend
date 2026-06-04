'use client';

// 팔로워·팔로잉 탭 + 목록 컨테이너 — 본인/타 유저 공용
import { useRouter } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { FollowTabKey, FollowedUser } from '@/lib/types/follow';

import { FollowEmpty } from './follow-empty';
import { FollowUserRow } from './follow-user-row';

interface Props {
  mode: 'self' | 'other';
  myId: string; // 본인 row에 팔로우 버튼을 숨기기 위해 상위에서 주입
  subjectName: string;
  initialTab: FollowTabKey;
  basePath: string;
  followers: FollowedUser[];
  following: FollowedUser[];
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
        <FollowUserRow key={user.id} user={user} hideFollowAction={user.id === myId} />
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
  const router = useRouter();

  function handleTabChange(value: string) {
    router.replace(`${basePath}/${value}`, { scroll: false });
  }

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

      <Tabs value={initialTab} onValueChange={handleTabChange} className="mt-4">
        <div className="px-8">
          <TabsList>
            <TabsTrigger value="followers">
              팔로워 {followers.length > 0 && <span className="ml-1 text-muted-foreground">{followers.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="following">
              팔로잉 {following.length > 0 && <span className="ml-1 text-muted-foreground">{following.length}</span>}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="followers" className="mt-4">
          <FollowTabPanel tab="followers" mode={mode} subjectName={subjectName} myId={myId} users={followers} />
        </TabsContent>

        <TabsContent value="following" className="mt-4">
          <FollowTabPanel tab="following" mode={mode} subjectName={subjectName} myId={myId} users={following} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
