// 상황 태그(이용 유형) 단일 출처 — 백엔드 RatingContext enum과 1:1 대응.
// 값을 추가·변경할 때는 이 배열만 고친다. 타입·표시 목록·양방향 매핑이 전부 여기서 파생된다.
// 배열 순서 = 화면 칩 표시 순서 (백엔드 선언 순서와 다른 것은 의도 — 표시 순서는 UI 결정)
export const SCENE_TAGS = [
  { context: 'ALONE', label: '혼밥' },
  { context: 'DATE', label: '데이트' },
  { context: 'COMPANY', label: '회식' },
  { context: 'FAMILY', label: '가족' },
  { context: 'FRIEND', label: '친구' },
] as const;

export type RatingContext = (typeof SCENE_TAGS)[number]['context']; // 백엔드 enum 이름
export type SceneTag = (typeof SCENE_TAGS)[number]['label']; // 화면에 노출되는 한글 라벨

// 상황 칩 표시 목록
export const OCCASIONS: SceneTag[] = SCENE_TAGS.map((tag) => tag.label);

// SCENE_TAGS에서 파생한 조회 테이블 — 배열이 단일 출처라 양방향 전수 대응이 보장된다
const CONTEXT_BY_TAG = Object.fromEntries(
  SCENE_TAGS.map((tag) => [tag.label, tag.context]),
) as Record<SceneTag, RatingContext>;

const TAG_BY_CONTEXT = Object.fromEntries(
  SCENE_TAGS.map((tag) => [tag.context, tag.label]),
) as Record<RatingContext, SceneTag>;

// 상황 태그(한글) → 백엔드 RatingContext — 리뷰 제출 경계에서 사용
export function sceneTagToRatingContext(tag: SceneTag): RatingContext {
  return CONTEXT_BY_TAG[tag];
}

// 백엔드 RatingContext → 상황 태그(한글) — 후기 조회 경계에서 사용.
// 백엔드가 프론트에 없는 값을 보낼 수 있으므로 undefined를 허용한다
export function ratingContextToSceneTag(context: RatingContext): SceneTag | undefined {
  return TAG_BY_CONTEXT[context];
}
