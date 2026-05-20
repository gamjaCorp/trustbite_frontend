# 1차 MVP 제외 항목 목록

코드베이스 전체에서 `// TODO: 1차 MVP 제외` 주석이 달린 항목의 집계 문서.
각 항목은 **비활성화 처리(준비 중 표시)** 또는 **mock → 실 API 교체 예정** 중 하나에 해당한다.

---

## UI 비활성화 처리 (준비 중 표시)

### /profile

| 항목 | 파일 | MVP 단계 |
|---|---|---|
| 포인트 카드 | `features/my-profile/points-and-lists-row.tsx` | 3차 |
| 함께 만든 리스트 카드 | `features/my-profile/points-and-lists-row.tsx` | 미정의 |
| 활동: 내가 쓴 리뷰 | `features/my-profile/my-profile-view.tsx` | 2차 |
| 활동: 잠금 해제한 미식 가이드 | `features/my-profile/my-profile-view.tsx` | 3차 |
| 활동: 도움됐어요 누른 리뷰 | `features/my-profile/my-profile-view.tsx` | 2차 |
| 설정: 활동 지역 | `features/my-profile/my-profile-view.tsx` | 미정의 |
| 설정: 알림 설정 | `features/my-profile/my-profile-view.tsx` | 미정의 |
| 설정: 계정 관리 | `features/my-profile/my-profile-view.tsx` | 미정의 |
| 설정: 로그아웃 | `features/my-profile/my-profile-view.tsx` | 미정의 |
| 이용약관 링크 | `features/my-profile/profile-footer.tsx` | 약관 페이지 미존재 |
| 개인정보처리방침 링크 | `features/my-profile/profile-footer.tsx` | 약관 페이지 미존재 |

### /restaurant/[id]

| 항목 | 파일 | MVP 단계 |
|---|---|---|
| 도움됐어요 버튼 (count 표시, 토글 없음) | `features/restaurant-detail/review-card.tsx` | 2차 |
| 공유 버튼 | `features/restaurant-detail/restaurant-summary.tsx` | 미구현 |
| 지도 줌 +/− 컨트롤 | `features/restaurant-detail/location-section.tsx` | 지도 SDK 연동 시 |
| 리뷰 CTA 바 포인트 카피 (+5pt) | `features/restaurant-detail/review-cta-bar.tsx` | 3차 |

### /my-places

| 항목 | 파일 | MVP 단계 |
|---|---|---|
| AI 미식 성향 분석 패널 | `features/my-restaurant/taste-profile-section.tsx` | 2차 |
| 공유 버튼 (전체 랭킹) | `features/my-restaurant/restaurant-rank-list.tsx` | 미구현 |
| 공유 버튼 (위시리스트) | `features/my-restaurant/wishlist-section.tsx` | 미구현 |

### /user/[id]

| 항목 | 파일 | MVP 단계 |
|---|---|---|
| AI 미식 성향 분석 패널 | `features/my-restaurant/taste-profile-section.tsx` | 2차 |
| "10P가 들어요" 카피 (→ 카피 단순화) | `features/user-profile/locked-rankings-section.tsx` | 3차 |
| 더보기(MoreHorizontal) 버튼 (DOM 제거) | `features/user-profile/user-profile-header.tsx` | 미정의 |

### /review/new, /restaurant/[id]/review/new

| 항목 | 파일 | MVP 단계 |
|---|---|---|
| 포인트 적립 칩 (+5P / +3P / +2P) | `features/review-write/trust-delta-card.tsx` | 3차 |
| 위치 인증 배너 | `features/review-write/location-verify-banner.tsx` | 2차 |
| 리뷰 결과 포인트 항목 | `features/review-result/review-result-dialog.tsx` | 3차 |

---

## Mock → 실 API 교체 예정

| 항목 | 파일 | 교체 시점 |
|---|---|---|
| Auth mock store | `stores/auth-mock-store.tsx` | NextAuth 세션 연결 시 |
| Auth mock 토글 UI | `common/auth-mock-toggle.tsx` | NextAuth 통합 후 |
| Follow mock store | `stores/follow-mock-store.tsx` | 3차 MVP (W11) |
| Follow mock data | `data/mock-follow.ts` | 3차 MVP (W11) |
| Wishlist mock store | `stores/wishlist-mock-store.tsx` | 백엔드 wishlist API 연결 시 |
| Wishlist mock data | `data/mock-wishlist.ts` | 백엔드 wishlist API 연결 시 |
| Helpful vote mock store | `stores/helpful-mock-store.tsx` | 2차 MVP |
| My profile mock store | `stores/my-profile-mock-store.tsx` | 백엔드 프로필 API 연동 시 |
| Review write store 포인트 로직 | `stores/review-write-store.tsx` | 3차 MVP (W11) |
| Delete review dialog mutation | `features/restaurant-detail/delete-review-dialog.tsx` | 백엔드 API 연동 시 |

---

> **업데이트 방법**: 새 `// TODO: 1차 MVP 제외` 주석이 추가될 때 이 파일에도 행을 추가한다.
> 빠른 전체 목록 조회: `grep -rn "TODO: 1차 MVP 제외" src/`
