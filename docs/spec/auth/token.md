# 인증 — 토큰 구조 및 세션 정책

> 인증 화면·흐름 기획은 [`index.md`](./index.md), API 계약은 [`backend-spec.md`](./backend-spec.md) 참조.

---

## 3계층 토큰 모델

TrustBite에서 "토큰"은 목적이 다른 3개 층으로 나뉜다. 섞이면 설계가 복잡해지므로 명확히 분리한다.

| 층 | 무엇 | 담당 역할 | 비고 |
|---|---|---|---|
| ① NextAuth 세션 (쿠키 JWT) | 우리 서비스의 로그인 상태 | **로그인 유지 전담** — 30일, 사용할 때마다 갱신(rolling) | 이게 "로그인 유지"의 실체 |
| ② Google access/refresh token | Google API를 대리 호출할 때 쓰는 출입증 | **우리는 미사용** | 구글 캘린더·드라이브 등 외부 Google API 호출 시에만 필요 |
| ③ 백엔드 accessToken | 우리 서비스 API(`/restaurants`, `/reviews` 등)의 출입증 | 로그인 사용자가 API 호출 시 `Authorization: Bearer`로 전달 | 수명 정책은 미정 — 아래 참조 |

---

## 백엔드 토큰의 저장 위치와 호출 방식 (설계 결정)

### 저장: NextAuth JWT 안에만 둔다

세션 전략이 JWT(stateless)라 서버에 저장소가 없다. 사용자별로 요청 간 유지해야 하는 값을 둘 곳은 NextAuth JWT 토큰(암호화 쿠키)뿐이다. 백엔드 accessToken도 여기에 저장한다.

```
Google 로그인 성공
  → auth.ts 의 jwt 콜백에서 POST /auth/login 호출 → 백엔드 accessToken 받음
  → token.accessToken = accessToken   (JWT 쿠키에 저장, 서버에서만 복호화)
```

현재 `auth.ts`의 `jwt` 콜백은 `token.id`만 담고 있다. W4에서 `token.accessToken` 저장 단계를 추가한다.

### 노출: 브라우저(클라이언트)에는 토큰을 노출하지 않는다 (BFF 방식 채택)

`session` 콜백으로 토큰을 클라이언트에 내보내면 `useSession()`으로 읽을 수 있어 간단하지만, XSS 시 탈취 위험이 있다. 따라서 **토큰은 서버에서만 접근(`auth()`)** 하고, 클라이언트에는 노출하지 않는다.

이 결정의 근거: 클라에 토큰을 한번 노출한 뒤 다시 거둬들이는 전환(B→A)은 `session` 노출 제거 + 엔드포인트별 프록시 신설 + 클라 호출 대상 변경이 동시에 필요해 비용이 크다. 1차 MVP의 클라 뮤테이션은 위시리스트·팔로우 정도로 적어 프록시 선투자가 작으므로, 처음부터 노출하지 않는 구조로 간다.

### 그러면 클라이언트 API 호출은 어떻게? — 우리 Next 서버가 중계

httpOnly 세션 쿠키는 **JS가 값을 읽을 수는 없지만, 같은 출처 요청에는 브라우저가 자동으로 실어 보낸다.** 이 성질을 이용해 클라는 백엔드를 직접 부르지 않고 우리 Next 서버를 거친다.

```
[브라우저] React Query useMutation
   fetch('/api/wishlist/123', { method: 'POST' })     ← 우리 Next 서버 주소 (백엔드 아님)
        │  httpOnly 세션 쿠키 자동 전송
        ▼
[Next 서버] Route Handler  /app/api/wishlist/[id]/route.ts
   const session = await auth()                        ← 쿠키 복호화 → accessToken (서버에서만)
   fetch(`${BACKEND}/wishlist/123`, { headers: { Authorization: `Bearer ${session.accessToken}` } })
        ▼
[백엔드] 자기 토큰 검증 → 처리
```

- **읽기(공개·개인 데이터)** — 이미 Server Component가 서버에서 백엔드를 직접 호출(`authedFetch` + `auth()`). 토큰이 브라우저로 나가지 않음. 추가 작업 없음.
- **클라 뮤테이션(위시리스트·팔로우 토글)** — 클라는 우리 `/api/...` 프록시(Route Handler) 또는 Server Action을 호출하고, 그 안에서 토큰을 붙여 백엔드로 중계한다.

> 함의: Day 4의 `clientFetch`는 백엔드 주소가 아니라 우리 `/api/...` 프록시를 향한다(토큰은 쿠키에 의존). 모든 클라 호출을 `clientFetch` + `src/api/<feature>` 함수 뒤로 모아두면 호출 대상이 한 곳으로 수렴해 유지보수가 쉽다.

---

## Google refresh token에 의존하지 않는다 (설계 결정)

과거에 "미인증 앱에서 Google refresh token이 7일 후 만료돼 갱신이 안 되는" 문제가 발생했다. 이 함정을 피하기 위해 명시적으로 Google refresh token에 의존하지 않는 구조를 택한다.

### Google refresh token의 두 함정

1. **최초 1회만 발급** — Google은 사용자가 처음 동의 화면을 통과할 때만 `refresh_token`을 준다. 이후 재로그인 시에는 발급하지 않는다. 강제로 받으려면 매번 `prompt=consent`로 동의 화면을 다시 띄워야 해 UX가 나빠진다.
2. **미인증(테스트) 앱은 7일 만료** — Google Cloud Console에서 앱이 "테스트" 상태이면 refresh token이 7일 후 만료된다. 이후에는 갱신이 불가능해 사용자가 재로그인해야 한다.

### 우리가 이 함정을 만나지 않는 이유

- TrustBite는 Google 로그인을 "로그인 시점의 신원 확인"으로만 사용한다. Google OAuth 완료 후에는 우리 서버에서만 데이터를 주고받으며, 이후 Google API를 추가로 호출하지 않는다.
- Google refresh token이 필요 없으므로 애초에 요청하지 않는다. (offline access 미설정)
- 로그인 유지는 ①(NextAuth 세션, 30일 rolling)이 담당한다. Google 토큰 만료와 무관하게 동작한다.

### Google 심사 부담도 없다

로그인에 필요한 scope(`openid` · `email` · `profile`)는 Google이 비민감(non-sensitive)으로 분류한다. 비민감 scope만 요청하면 Google 보안 심사(verification) 없이 앱을 프로덕션으로 게시할 수 있다. 설령 미래에 refresh token이 필요해지더라도 만료 문제가 없다.

---

## 백엔드 accessToken 수명 정책 (미결정)

로그인 유지는 ①이 해결했지만, 백엔드 API 출입증(③)의 수명을 어떻게 설정하느냐에 따라 후속 설계가 달라진다. 두 선택지:

| 선택지 | 설명 | 장점 | 단점 |
|---|---|---|---|
| **(A) 길게 1개** (예: 30일) | NextAuth 세션과 수명을 맞춤 | 단순. 별도 갱신 로직 불필요 | 토큰 강제 무효화(도난·로그아웃) 어려움 |
| **(B) 짧게 + 자체 refreshToken** (예: 1시간 + 30일) | 보안 강화 | "모든 기기 로그아웃", 도난 토큰 즉시 차단 가능 | NextAuth `jwt` 콜백에 만료 감지·갱신 로직 필요 |

이 결정이 정해지면 아래 항목들이 함께 확정된다:
- `POST /auth/logout`(서버 denylist) 필요 여부
- 백엔드 refreshToken 제공 여부 및 갱신 endpoint
- NextAuth `jwt` 콜백 갱신 로직 추가 여부

Google과 전혀 무관하게 자유롭게 결정할 수 있다.
