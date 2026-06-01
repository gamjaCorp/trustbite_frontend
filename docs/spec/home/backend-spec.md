# 홈 화면 — 백엔드 스펙

> 홈(`/`) 페이지 API 계약. 화면 기획은 [`index.md`](./index.md), [`search.md`](./search.md) 참조.

---

## API 목록

홈 화면에서 백엔드 호출은 세 가지다.

| 엔드포인트 | 용도 | 호출 시점 |
|---|---|---|
| `GET /restaurants/suggest` | 검색창 자동완성 후보 | 검색어 입력 시 (debounce 500ms) |
| `GET /restaurants/search` | 지도 영역 내 맛집 목록 | 화면 최초 로드 / "이 지역에서 검색" / 카테고리·정렬 변경 / "더 불러오기" |
| `POST /wishlist/:restaurantId` `DELETE /wishlist/:restaurantId` | 북마크(위시리스트) 저장·취소 | 카드 북마크 버튼 클릭 시 (로그인 필수) |

---

## 공통 규약

- **Base URL**: 환경 변수 `NEXT_PUBLIC_API_BASE_URL`
- **인증**: 비로그인도 가능. 로그인 시 `Authorization: Bearer {토큰}` 선택적 전달. `myStatus`, `isBookmarked` 등 내 데이터는 토큰 있을 때만 채워짐.
- **좌표**: `lat`/`lng` 숫자로 통일. Kakao `x/y` 문자열 변환은 서버 내부에서 처리.
- **빈 결과**: `200 OK` + `results: []`
- **에러 응답**: `{ error: { code: string; message: string } }` + HTTP 상태 코드

---

## 엔드포인트 1 — `GET /restaurants/suggest`

검색창에 글자를 입력하고 500ms가 지나면 호출된다. 지도 위치와 무관한 **전국 검색**이다.

**이 엔드포인트는 자동완성·가게 단건 조회만 담당한다.** 키워드로 여러 가게의 리스트를 불러오는 것은 지원하지 않는다. 자유 키워드 검색 후 가게를 하나 확정하면, 그 가게 1개로 Focus 모드(상세는 `index.md` 6장 참조)에 진입한다. 리스트는 항상 `/search`의 뷰포트 기반으로만 채워진다. (q 파라미터를 `/search`에 두지 않는 이유: `/suggest`는 매 타이핑 호출이라 가볍게 설계해야 하고 — 랭킹 계산·거리 계산 없음 — `/search`는 뷰포트·trustScore·rank를 무겁게 계산하며 lat/lng/radius가 필수다. 성능 프로필과 필수 파라미터가 달라 분리를 유지한다.)

응답은 두 가지 중 하나다.

- **area** — 입력어가 지역(주소·역·관광지)으로 판단됨. 지도를 어디로 이동할지 좌표를 준다.
- **keyword** — 입력어가 가게 이름·음식 종류로 판단됨. 드롭다운에 보여줄 후보 목록을 준다.

둘이 동시에 채워지는 경우는 없다.

### 요청

```
GET /restaurants/suggest?q={query}&size=10
```

| 파라미터 | 필수 | 설명 |
|---|---|---|
| `q` | ✅ | 검색어 |
| `size` | ❌ | 반환 최대 수. 기본값 `10` |

`lat` / `lng` / `radius`는 받지 않는다.

### 응답

```ts
interface SuggestResponse {
  resolvedAs: 'area' | 'keyword';
  area?: {
    label: string;                          // 예: "강남구", "강남역"
    center: { lat: number; lng: number };
  };
  items?: SuggestItem[];                    // keyword일 때. 빈 배열 가능
}

interface SuggestItem {
  id: string;
  name: string;
  category: '한식' | '일식' | '중식' | '양식' | '분식' | '치킨' | '패스트푸드' | '카페' | '술집' | '기타';
  address: string;
  coordinates: { lat: number; lng: number };
}
```

### `resolvedAs` 판단 규칙

서버가 아래 순서로 입력어 성격을 판단한다.

**1단계** — Kakao `address.json`으로 검색. 결과 있으면 → `area`

**2단계** — 주소 결과 없으면 Kakao `keyword.json` 검색. top 결과 카테고리 확인:
- `SW8`(지하철역), `AT4`(관광명소) → `area`
- `FD6`(음식점), `CE7`(카페), 그 외 → `keyword`

**3단계** — 양쪽 결과 없으면 → `keyword` + `items: []`

#### 예시

| 입력 | 판단 결과 | 이유 |
|---|---|---|
| "강남구" | `area` | 주소 검색 결과 있음 |
| "강남역" | `area` | 키워드 top이 SW8 |
| "광화문국밥" | `keyword` | 키워드 top이 FD6 |
| "asdfqwer" | `keyword` + `items: []` | 양쪽 결과 없음 |

### 프론트 동작

- `area` → `area.center`로 지도 이동 → 이어서 `GET /restaurants/search` 자동 호출
- `keyword` → 드롭다운 노출 → 선택 시 Focus 모드 진입 (해당 가게 1개만 표시)

---

## 엔드포인트 2 — `GET /restaurants/search`

현재 지도에 보이는 영역(viewport) 안의 맛집 목록을 가져온다. 응답의 `hasMore`가 `true`이면 "더 불러오기" 버튼을 표시하고, 다음 페이지를 받으면 기존 리스트 뒤에 이어 붙인다.

### 요청

```
GET /restaurants/search?lat={lat}&lng={lng}&radius={radius}
```

| 파라미터 | 필수 | 설명 |
|---|---|---|
| `lat` | ✅ | 지도 중심 위도 |
| `lng` | ✅ | 지도 중심 경도 |
| `radius` | ✅ | 검색 반경(미터). 프론트가 화면 크기로 자동 계산. 최대 20,000m |
| `category` | ❌ | `'한식'`·`'일식'`·`'중식'`·`'양식'`·`'분식'`·`'치킨'`·`'패스트푸드'`·`'카페'`·`'술집'`·`'기타'`·`'all'`. 기본 `'all'` |
| `sort` | ❌ | `'rank'`(기본)·`'trust'`·`'recent'`. 상세는 아래 정렬 규칙 참조 |
| `page` | ❌ | 1부터. 기본 `1` |
| `size` | ❌ | 기본 `30` |

`q` 파라미터는 없다. 키워드 검색은 `/restaurants/suggest`에서 처리한다 (이유는 엔드포인트 1 서두 참조).

#### 정렬 규칙

| `sort` 값 | 정렬 기준 |
|---|---|
| `rank` (기본) | 내부 rank 오름차순. rank 계산식은 아래 서버 계산 책임 참조 |
| `trust` | 가게 trustScore 내림차순 |
| `recent` | 가게 단위 가장 최근 리뷰 작성 시각(`lastReviewedAt`) 내림차순 |

### 응답

```ts
interface SearchResponse {
  results: RegionalRankEntry[];
  page: number;
  hasMore: boolean;
  total?: number;
}

type RegionalRankEntry = {
  id: string;
  name: string;
  category: '한식' | '일식' | '중식' | '양식' | '분식' | '치킨' | '패스트푸드' | '카페' | '술집' | '기타';
  region: string;              // 서버가 역지오코딩으로 산출. 예: "서울 마포구"
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  distanceMeters: number;      // 검색 중심 기준 직선 거리. 서버 계산

  communityAvgScore: number;   // 커뮤니티 평균 별점 (0~5)
  reviewCount: number;
  trustScore: number;          // 신뢰도 점수 (0~100)
  trustBreakdown: TrustBreakdown;
  rank: number;                // 페이지 걸쳐 연속. page 2 첫 번째 = rank 31
  lastReviewedAt: string;      // 가게 단위 가장 최근 리뷰 작성 시각 (ISO 8601). sort=recent 정렬용

  // 로그인 시에만 채워짐
  isBookmarked?: boolean;      // 내 위시리스트에 저장 여부

  // 로그인 + 내가 기록한 경우에만 채워짐
  myStatus?: 'none' | 'visited' | 'reviewed';
  scores?: { taste: number; value: number; vibe: number };
  avgScore?: number;
  comment?: string;
  visitCount?: number;
  lastVisitedAt?: string;      // ISO 8601
};

interface TrustBreakdown {
  photoRatio: number;           // 사진 첨부 비율 (0~1)
  longTextRatio: number;        // 장문 리뷰 비율 (0~1)
  recentActivityRatio: number;  // 최근 활동 비율 (0~1)
}
```

### 페이지네이션 계약

- 한 응답은 최대 `size`개. 기본 30개.
- `rank`는 페이지를 넘어 연속. page 1 마지막이 30이면 page 2 첫 번째는 31.
- 지역 이동·카테고리·정렬 변경 시 항상 `page=1`로 리셋, rank도 1부터 재시작.
- 동일 쿼리에서 page 1→2 정렬 순서가 일관되어야 한다.

### 서버 계산 책임

| 값 | 계산 방법 |
|---|---|
| `distanceMeters` | Haversine 공식으로 검색 중심 ↔ 가게 좌표 직선 거리 |
| `rank` | 정렬 후 1부터. 권장: `communityAvgScore` 내림차순, 동점 시 `trustScore` 내림차순 |
| `trustScore` | 사진·장문·최근 활동 비율 종합해 0~100 환산 |
| `region` | 좌표 → Kakao `coord2regioncode.json` → 행정구역명 |
| `lastReviewedAt` | 해당 가게의 리뷰 중 가장 최근 `createdAt` |

---

## 엔드포인트 3 — `POST /wishlist/:restaurantId` / `DELETE /wishlist/:restaurantId`

가게 카드의 북마크 버튼을 누를 때 호출된다. 인증 필수(`Authorization: Bearer {토큰}`).

### 저장

```
POST /wishlist/:restaurantId
```

성공 시 `200 OK` + 빈 body (또는 `{ success: true }`). 이미 저장된 경우도 `200 OK`로 처리한다(멱등성 보장).

### 취소

```
DELETE /wishlist/:restaurantId
```

성공 시 `200 OK` + 빈 body. 저장 내역이 없는 경우도 `200 OK`로 처리한다(멱등성 보장).

### 공통 에러

- `401 Unauthorized` — 비로그인 상태 (프론트에서 로그인 안내로 대체하므로 실제 호출은 없어야 함)
- `404 Not Found` — 존재하지 않는 `restaurantId`

---

## Kakao REST API 참고 (백엔드 구현용)

Kakao Local REST API를 1차 데이터 소스로 사용한다. 프론트에서 쓰는 JS 앱키와 다른 **REST 키**를 별도 발급받아야 한다.

- **Base URL**: `https://dapi.kakao.com`
- **인증 헤더**: `Authorization: KakaoAK {KAKAO_REST_API_KEY}`
- **좌표**: Kakao 응답의 `x` = 경도(lng), `y` = 위도(lat)

| 용도 | Kakao REST 엔드포인트 |
|---|---|
| 반경 내 음식점·카페 검색 | `GET /v2/local/search/category.json` (`category_group_code=FD6` 또는 `CE7`) |
| 키워드로 장소 검색 | `GET /v2/local/search/keyword.json` |
| 주소·지역명 → 좌표 | `GET /v2/local/search/address.json` |
| 좌표 → 행정구역명 | `GET /v2/local/geo/coord2regioncode.json` |
| 좌표 → 도로명 주소 | `GET /v2/local/geo/coord2address.json` |

`category.json` / `keyword.json` 공통 파라미터: `x`(경도), `y`(위도), `radius`(미터, 최대 20,000), `page`(1~45), `size`(1~15), `sort`(`distance` | `accuracy`).

---

## 미정 · 논의 필요

- **랭킹 정렬 기준** — `communityAvgScore` 내림차순, 동점 시 `trustScore` 내림차순이 권장안. 확정 필요.
- **`imageUrl` 정책** — Kakao 이미지 URL을 그대로 쓸지, 서버에 저장·리사이징할지 미정.
- **Suggestion 거리 가중** — 동명 가게 여러 곳일 때 현재 지도 중심을 옵셔널 파라미터로 받아 가까운 것 우선 여부.
- **area·keyword 혼합어** — "강남 파스타" 등은 현재 `keyword`로 처리. 지역 토큰 분리는 MVP 제외.
- **지역 필터 API** — 시/도 → 시/군/구 드롭다운 필터 구현 시 필요. 좌표 중심 이동 방식(지역명 → 대표 좌표)으로 할지, 행정구역 코드 기반 검색 파라미터를 `/search`에 추가할지 논의 필요.
- **"새 맛집 추가하기" 흐름** — 홈 빈 결과 상태 CTA. 사용자가 직접 가게를 등록하는 방식인지, Kakao 플레이스 연동인지 미정.
