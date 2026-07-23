# 맛집 상세 페이지 — 백엔드 스펙

> 프론트↔백엔드 계약 문서. `/restaurant/[id]` 페이지에서 사용.

---

## 1. 엔드포인트

```
GET /restaurants/:id
```

맛집 상세 페이지에 필요한 모든 데이터를 한 번의 호출로 가져온다.

### 요청

별도 쿼리 파라미터 없음. URL의 `:id`는 `/restaurants/search`나 `/restaurants/suggest` 응답의 `id` 값을 그대로 사용한다.

로그인한 경우 `Authorization: Bearer {토큰}` 헤더를 전달하면 `myReview`, `repeatVisitReview` 등 내 데이터가 채워진다.

### 응답 — `200 OK`

```ts
interface RestaurantDetail {
  // 기본 정보
  id: string;
  name: string;
  category: '한식' | '일식' | '중식' | '양식' | '카페' | '술집' | '기타';
  subCategory?: string;          // 세부 카테고리 (예: "스시", "파스타")
  region: string;                // 행정구역명. 서버가 역지오코딩으로 산출 (예: "서울 마포구")
  tagline?: string;              // 한 줄 소개
  address: string;               // 도로명 주소
  accessSummary: string;         // 찾아오는 방법 요약 (예: "2호선 홍대입구역 3번 출구 도보 5분")
  hours: { weekday: string };    // 영업시간 (예: "11:00 ~ 22:00")
  coordinates: { lat: number; lng: number };
  photos: string[];              // 대표 사진 URL 목록
  totalPhotoCount: number;       // 전체 사진 수 (리스트에 없는 것 포함)
  locationDescription: string;   // 위치 설명 텍스트

  // 커뮤니티 평가
  communityAvgScore: number;     // 커뮤니티 평균 별점 (0~5)
  dimensionScores: RatingScores; // 항목별 평균 (맛·가성비·분위기)
  sceneScores: { tag: SceneTag; score: number }[]; // 씬 태그별 점수
  trustScore: number;            // TrustScore (0~100)
  trustBreakdown: TrustBreakdown;
  reviewCount: number;           // 총 리뷰 수

  // 내 데이터 — 로그인 + 내가 리뷰를 작성한 경우에만
  myReview?: MyReview;
  repeatVisitReview?: RepeatVisitReview;

  // 다른 사람들의 리뷰
  reviews: DetailedReview[];

  // 위치 보조 정보 — 서버가 Kakao 역지오코딩으로 산출
  nearestStation?: { name: string; walkMinutes: number }; // 가장 가까운 지하철역
  buildingName?: string;          // 건물명 (예: "홍대 CGV 빌딩")
  administrativeArea?: string;    // 법정동명 (예: "서교동")
}
```

### 에러

- `404 Not Found` — 존재하지 않는 id

---

## 2. 보조 타입

```ts
interface RatingScores {
  taste: number;   // 맛 (1~5)
  value: number;   // 가성비 (1~5)
  vibe: number;    // 분위기 (1~5)
}

interface TrustBreakdown {
  photoRatio: number;           // 사진 첨부 리뷰 비율 (0~1)
  longTextRatio: number;        // 장문 리뷰 비율 (0~1)
  recentActivityRatio: number;  // 최근 활동 비율 (0~1)
}
```

---

## 3. 서버 계산 책임

상세 페이지에서 서버가 직접 계산해 응답에 포함해야 하는 값들이다.

| 값 | 계산 방법 |
|---|---|
| `region` | 가게 좌표 → Kakao `coord2regioncode.json` → 행정구역명 조합 |
| `accessSummary` | 가게 좌표 → 가장 가까운 지하철역(SW8 카테고리) 검색 → "역명 N번 출구 도보 M분" 포맷. `walkMinutes = ceil(거리m ÷ 80)` |
| `nearestStation` | 위와 동일 과정에서 추출 |
| `buildingName` | 가게 좌표 → Kakao `coord2address.json` → 건물명 추출 |
| `administrativeArea` | 가게 좌표 → Kakao `coord2regioncode.json` → 법정동명 |
| `trustScore` | 사진 비율·장문 비율·최근 활동 비율을 종합해 0~100으로 환산 |

---

## 4. 공통 API 규약

- **Base URL**: `NEXT_PUBLIC_API_BASE_URL` 환경 변수
- **인증**: 비로그인도 조회 가능. 로그인 시 `Authorization: Bearer {토큰}` 선택적 전달. 내 데이터는 토큰 있을 때만 채워짐.
- **좌표**: `lat`/`lng` 숫자(degree)로 통일. Kakao의 `x/y` 문자열 변환은 서버 내부에서 처리.
- **에러 응답**: `{ error: { code: string; message: string } }` + 적절한 HTTP 상태 코드

---

## 5. 미정·논의 필요

- **`photos` 소스** — Kakao 이미지를 그대로 쓸지, 우리 서버에 저장·리사이징할지 정책 미정
- **`reviews` 페이지네이션** — 현재 전체 반환. 리뷰가 많아지면 별도 엔드포인트(`GET /restaurants/:id/reviews`) 분리 여부
- **`sceneScores` 태그 목록** — 사용할 SceneTag 값 목록 확정 필요
