# Typography — 텍스트 유틸 표

`globals.css`의 `@utility` semantic 유틸만 사용한다. **raw `text-3xl font-bold`, `text-sm font-medium` 류 조합 금지.** `letter-spacing: -0.02em`은 모든 유틸에 내장되어 있어 별도 지정 불필요.

## Defaults (Toss·당근 기준 매핑)

기본 선택을 명시한다. 추측·관성으로 caption을 고르지 않는다.

| 맥락 | 기본 유틸 | px/weight | 레퍼런스 |
|---|---|---|---|
| 일반 본문 | `text-body-1` | 16/400 | Toss 송금/홈 본문 15-17px |
| 리스트 1차 텍스트 (카드 제목·매장명) | `text-title-1` | 16/600 | 당근 매물 카드 제목 ~17px |
| 리스트 2차 텍스트 (주소·메타) | `text-body-2` | 14/500 | 당근 카드 보조 라인 |
| 폼 라벨 | `text-title-2` | 14/600 | Toss 입력 라벨 |
| 1차 CTA 버튼 텍스트 | `text-label-1` | 16/500 | Toss "송금하기" 버튼 |
| 보조 버튼·작은 칩 라벨 | `text-label-2` | 14/600 | — |
| 메타·타임스탬프·꼬리표 | `text-caption-2` | 12/400 | (캡션 한정) |

**금지**: `text-caption-2`/`text-label-3`를 본문·리스트 제목·버튼 라벨 자리에 쓰지 않는다. 12px 본문은 모바일에서 가독성 미달.

| 유틸 | 크기/줄높이/굵기 | 사용 맥락 |
|---|---|---|
| `text-headline-1` | 24px / 32px / 600 | 페이지 제목, 주요 섹션 헤더 |
| `text-headline-2` | 20px / 28px / 600 | 서브 섹션 제목 |
| `text-headline-3` | 16px / 24px / 600 | 다이얼로그·카드 내 소제목 |
| `text-title-1` | 16px / 24px / 600 | 카드 이름, UI 단위 제목 |
| `text-title-2` | 14px / 20px / 600 | 폼 라벨, 보조 제목 |
| `text-title-3` | 14px / 20px / 500 | 중간 강조 텍스트 |
| `text-body-1` | 16px / 24px / 400 | 일반 본문 |
| `text-body-2` | 14px / 20px / 500 | 보조 본문 |
| `text-body-3` | 12px / 16px / 400 | 작은 본문 |
| `text-label-1` | 16px / 24px / 500 | 버튼 텍스트, 입력 필드 내 텍스트 |
| `text-label-2` | 14px / 20px / 600 | 작은 버튼, 배지 텍스트 |
| `text-label-3` | 12px / 16px / 500 | 태그, 칩 텍스트 |
| `text-caption-1` | 14px / 20px / 400 | 보조 설명, hint 텍스트 |
| `text-caption-2` | 12px / 18px / 400 | 마이크로 텍스트, 타임스탬프 |

토큰 소스: `src/app/globals.css` 338–441줄
