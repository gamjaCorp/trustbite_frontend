# Note

## 2026-07-31 — 팔로우 목록 탭 통합 후속 (탭 전환 반응성)

**Q.** `useOptimistic`과 `useTransition`은 각각 무엇을 해결하는 훅인가?

**A.** 두 훅은 다른 질문에 답한다 — `useTransition`은 "지금 기다리는 중인가?", `useOptimistic`은 "기다리는 동안 무엇을 보여줄까?". 그래서 짝으로 쓰인다.

- `const [isPending, startTransition] = useTransition()` — `startTransition(fn)` 안의 상태 변경·네비게이션은 긴급하지 않은 업데이트로 표시되고, React는 새 UI를 준비하는 동안 이전 화면을 인터랙티브하게 유지한다. Next.js App Router에서는 `router.replace`/`push`를 `startTransition` 안에서 호출하면 **새 라우트의 RSC 페이로드가 커밋될 때까지 `isPending`이 true로 유지**되므로, 서버 컴포넌트 fetch 완료 시점을 클라이언트에서 알 수 있다. `startTransition` 없이 `router.replace`만 부르면 네비게이션은 되지만 진행 상태를 알 수 없어 로딩 표시를 붙일 수 없다.
- `const [optimistic, setOptimistic] = useOptimistic(realValue)` — 평소엔 `realValue`를 그대로 반환하고, Action(= `startTransition` 안)에서 `setOptimistic(x)`를 부르면 그 트랜지션 동안만 `x`를 반환한다. 트랜지션이 끝나면 덧칠이 저절로 벗겨지며, optimistic과 real state가 **같은 렌더에서 수렴**하므로 깜빡임이 없다.
- 제약: `setOptimistic`은 반드시 `startTransition` 콜백(또는 form `action` prop) 안에서 호출해야 한다. 밖에서 부르면 `An optimistic state update occurred outside a Transition or Action` 경고가 뜨고 덧칠이 아주 짧게만 보인다.

적용 대상은 `src/components/features/follow/follow-tabs.tsx`. 진실은 URL의 `?tab=`을 페이지(`src/app/profile/follows/page.tsx`, `src/app/user/[id]/follows/page.tsx`)가 파싱해 내려주는 `initialTab`이고, 덧칠은 클릭 순간부터 RSC 응답 커밋까지 유효한 `optimisticTab`, 기다림 표시는 패널의 `opacity-60`.

**배운 점** — `useState` + `useEffect(() => setTab(initialTab), [initialTab])`로도 같은 걸 만들 수 있지만 세 가지가 나빠진다: ① 렌더가 한 번 더 돌고, ② `initialTab`이 바뀐 렌더와 `setTab`이 반영된 렌더 사이에 로컬 상태와 URL이 어긋난 순간이 생기고, ③ 네비게이션 실패·취소 시 되돌리는 코드를 직접 써야 한다. `useOptimistic`은 값을 **소유하지 않고 파생**시키기 때문에 탭 클릭·브라우저 뒤로가기·외부 링크 진입 등 `initialTab`이 바뀌는 모든 경로에 동기화 코드 없이 따라간다.

또한 `loading.tsx`(Suspense 경계)는 라우트 전체를 폴백으로 교체하므로, 헤더·탭 바는 유지하고 패널만 흐리게 하는 부분 로딩에는 `isPending`이 맞다.

**Q.** `startTransition` 콜백 안에서 `setOptimisticTab(tabType)`과 `router.replace(...)`를 순서대로 실행하는 동안, `isPending`은 그 두 줄이 실행되는 동안만 `true`인가?

**A.** 아니다 — `isPending`은 `startTransition` 호출 시점부터 네비게이션(②번 `router.replace`)이 실제로 커밋될 때까지 전체 구간 동안 `true`다. 단순히 "두 줄이 실행되는 시간"이 아니라 "트랜지션이 끝날 때까지의 구간"이다.

- `setOptimisticTab(tabType)`(①)은 동기 코드라 즉시 끝나고, 화면의 탭 밑줄은 `isPending` 값과 무관하게 그 순간 바로 옮겨간다 — `useOptimistic`의 덧칠은 `isPending`을 기다리지 않고 바로 보인다.
- `router.replace(...)`(②)는 새 라우트의 RSC 데이터 요청을 "시작"만 시키고, 그 응답이 도착해 화면에 커밋될 때까지 React는 `isPending = true`를 유지한다.
- 응답이 커밋되는 순간 `isPending`이 `false`로 돌아가고, 동시에 `optimisticTab`의 덧칠도 벗겨지며 실제 `initialTab`과 같아진다(같은 렌더에서 수렴).
- 즉 체감상 진짜 "기다림"은 ①번이 아니라 ②번의 서버 왕복에서만 발생하며, `isPending`이 다루는 구간은 ①+②를 합친 전체가 아니라 정확히는 "②가 끝날 때까지"다.

관련 파일: `src/components/features/follow/follow-tabs.tsx`(`handleTabChange` 내부).
