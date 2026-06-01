'use client';

// 팔로워·팔로잉 탭 + 목록 컨테이너 — 본인/타 유저 공용
import { useRouter } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getMyProfile } from '@/data/mock-my-profile';
import type { FollowTabKey, FollowedUser } from '@/lib/types/follow';

import { FollowEmpty } from './follow-empty';
import { FollowUserRow } from './follow-user-row';

interface Props {
  mode: 'self' | 'other';
  subjectName: string;
  initialTab: FollowTabKey;
  basePath: string;
  followers: FollowedUser[];
  following: FollowedUser[];
}

export function FollowListView({
  mode,
  subjectName,
  initialTab,
  basePath,
  followers,
  following,
}: Props) {
  const router = useRouter();
  const myId = getMyProfile().id;

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
          {followers.length === 0 ? (
            <FollowEmpty mode={mode} tab="followers" subjectName={subjectName} />
          ) : (
            <ul>
              {followers.map((user) => (
                <FollowUserRow
                  key={user.id}
                  user={user}
                  hideFollowAction={user.id === myId}
                />
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-4">
          {following.length === 0 ? (
            <FollowEmpty mode={mode} tab="following" subjectName={subjectName} />
          ) : (
            <ul>
              {following.map((user) => (
                <FollowUserRow
                  key={user.id}
                  user={user}
                  hideFollowAction={user.id === myId}
                />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
