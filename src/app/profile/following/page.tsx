import { FollowListView } from '@/components/features/follow/follow-list-view';
import { getFollowers, getFollowing } from '@/data/mock-follow';
import { getMyProfile } from '@/data/mock-my-profile';

export default function MyFollowingPage() {
  const profile = getMyProfile();
  return (
    <FollowListView
      mode="self"
      subjectName={profile.name}
      initialTab="following"
      basePath="/profile"
      followers={getFollowers(profile.id)}
      following={getFollowing(profile.id)}
    />
  );
}
