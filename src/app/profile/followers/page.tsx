import { FollowListView } from '@/components/features/follow/index';
import { getFollowers, getFollowing } from '@/data/mock-follow';
import { getMyProfile } from '@/data/mock-my-profile';

export default function MyFollowersPage() {
  const profile = getMyProfile();
  return (
    <FollowListView
      mode="self"
      subjectName={profile.name}
      initialTab="followers"
      basePath="/profile"
      followers={getFollowers(profile.id)}
      following={getFollowing(profile.id)}
    />
  );
}
