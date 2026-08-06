import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsStrip } from '@/components/common/display/stats-strip';
import { GradeCellValue } from '@/components/common/trust/grade-cell-value';
import { MyPlacesTabs } from './_components';
import { loadMyRatingsPage } from './_lib/load-my-ratings';
import { getMyProfile } from '@/api/user/user';
import { getGrades } from '@/api/grade/grade';
import { getTrustToneClass, toTrustPercent } from '@/lib/domain/trust-score';

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function MyRestaurantPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab = tab === 'wishlist' ? 'wishlist' : 'ranking';

  const [profile, grades, ratingsPage] = await Promise.all([
    getMyProfile().catch(() => null),
    getGrades().catch(() => null),
    loadMyRatingsPage(0),
  ]);

  // Lv.N의 N은 등급 사다리 순위 — 로컬 상수가 아니라 서버가 소유한다
  const gradeRank = grades?.find((g) => g.name === profile?.grade)?.rank;

  // 리뷰 수는 프로필이 원본 — 후기 목록 조회가 실패해도 숫자는 유지된다
  const reviewCount = profile?.reviewCount ?? ratingsPage.totalElements;
  // 프로필을 못 불러오면 0%가 아니라 '-' — "신뢰도 없음"과 "신뢰도 0"을 섞지 않는다
  const trustScore = profile ? toTrustPercent(profile.trustScore) : null;

  return (
    <>
      <div className="max-w-5xl mx-auto px-5 lg:px-6 pt-6 pb-24">
        <div className="mt-8">
          <StatsStrip
            items={[
              { label: '리뷰', value: `${reviewCount}개` },
              {
                label: '신뢰도',
                value: trustScore != null ? `${trustScore}%` : '-',
                valueClassName: trustScore != null ? getTrustToneClass(trustScore).text : undefined,
              },
              {
                label: (
                  <span className="flex items-center gap-0.5">
                    등급 <ChevronRight className="w-3 h-3" />
                  </span>
                ),
                value: <GradeCellValue grade={profile?.grade} rank={gradeRank} />,
                href: '/profile',
              },
            ]}
          />
        </div>

        <Suspense>
          <MyPlacesTabs
            initialTab={activeTab}
            entries={ratingsPage.entries}
            hasMore={!ratingsPage.last}
          />
        </Suspense>
      </div>

      <Button asChild size="lg" className="fixed bottom-8 right-8 px-5 shadow-lg">
        <Link href="/review">
          <PencilLine className="w-4 h-4" />
          리뷰 쓰기
        </Link>
      </Button>
    </>
  );
}
