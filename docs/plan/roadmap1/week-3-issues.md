# Week 3 — 이슈 기록

## Day 2 · SDK/핀 검토 (2026-05-27)

- `restaurant-pin.tsx` 전체 미사용 (`buildPinHtml` import 없음) → 파일 삭제
- `MapBounds` 인터페이스(`map-view.tsx`) 미사용 → 삭제
- `onIdle → setPendingArea` 매 idle마다 발화, 최초 로드·panTo 직후 재검색 버튼 오발화 → `searchedCenterRef` + 30% 이동 임계값 가드로 수정
- `CategoryPin` 주석 "primary 색상 통일" — 실제 `bg-neutral-400` 사용으로 불일치 → 주석 정정. 핀 색상 토큰은 Day 5 디자인 패스에서 처리
- 핀 클릭이 `<div onClick>` — 키보드 접근·aria 없음 → `<button type="button" aria-label>` 로 교체
- CLAUDE.md에 `NEXT_PUBLIC_KAKAO_MAP_KEY` 표기 — 코드·env는 `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` → CLAUDE.md 정정

## Day 2 · 동기화/검색 검토 (2026-05-27)

- 핀 클릭 스크롤(`scrollIntoView block:center`)이 tall sticky 지도 뒤로 행을 가림, `scroll-mt-[180px]`은 `block:start`용이라 무효(데드 CSS) → sticky 실측 `rect.bottom` 기반 `window.scrollBy`로 교체, scroll-mt 제거
- 드래그 후 pendingArea 셋 상태에서 지명 검색(`navigate`)하면 버튼이 예전 위치를 가리킨 채 잔존 → `navigate()`에 `setPendingArea(null)` 추가
- 행→핀 역방향 하이라이트 없음 → 행이 상세 Link라 의도된 단방향
- `useNearbyPlaces` `placeholderData:[]` + 호출부 `= []` 디폴트 중복 → 무해, 경미
- SDK 미로딩 중 지명 검색 입력 유실 → MVP 범위 밖, Day 4 이후 위임
