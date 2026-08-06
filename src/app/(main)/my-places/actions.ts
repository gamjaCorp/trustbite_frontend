'use server';

import { loadMyRatingsPage, type MyRatingsPage } from './_lib/load-my-ratings';

// 전체 랭킹 "더보기" — /api/ratings 프록시 라우트가 없어 클라 fetch 대신 서버 액션으로 다음 페이지를 가져온다
export async function loadMoreMyRatings(page: number): Promise<MyRatingsPage> {
  return loadMyRatingsPage(page);
}
