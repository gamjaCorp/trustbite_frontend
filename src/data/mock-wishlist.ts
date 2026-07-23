// TODO: 1차 MVP 제외 — 백엔드 wishlist API 연결 시 제거
// 위시리스트 시드 데이터 — 스토어 initial state에서 사용
export const initialWishlistSeed = [
  { restaurantId: '1', addedAt: '2026-05-14T18:00:00.000Z' },
  { restaurantId: '4', addedAt: '2026-05-10T12:00:00.000Z' },
  { restaurantId: '5', addedAt: '2026-05-08T09:30:00.000Z' },
] as const satisfies ReadonlyArray<{ restaurantId: string; addedAt: string }>;
