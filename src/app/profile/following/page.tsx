import { FollowListView } from '@/components/features/follow/index';
import { getFollowers, getFollowing } from '@/data/mock-follow';
import { getMyProfile } from '@/data/mock-my-profile';

// 내 팔로잉 목록 페이지
export default function MyFollowingPage() {
  const profile = getMyProfile();
  return (
    <FollowListView
      mode="self"
      myId={profile.id}
      subjectName={profile.name}
      initialTab="following"
      basePath="/profile"
      followers={getFollowers(profile.id)}
      following={getFollowing(profile.id)}
    />
  );
}
