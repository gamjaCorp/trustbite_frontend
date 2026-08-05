import { mockRankList } from '@/data/mock-restaurant';
import { ReviewWriteForm } from '@/components/features/review-write/index';
import { getMyProfile } from '@/api/user/user';
import { notFound } from 'next/navigation';

// 리뷰 작성 페이지
export default async function NewReviewPage() {
  const myTopRestaurants = [...mockRankList].sort((a, b) => b.avgScore - a.avgScore).slice(0, 10);

  const profile = await getMyProfile();

  console.log(profile);
  if (!profile) {
    notFound();
  }

  return (
    <ReviewWriteForm
      candidates={mockRankList}
      myTopRestaurants={myTopRestaurants}
      profile={profile}
    />
  );
}
