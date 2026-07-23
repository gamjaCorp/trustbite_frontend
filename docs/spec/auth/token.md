# 인증 — 토큰 구조 및 세션 정책

> 인증 화면·흐름 기획은 [`index.md`](./index.md), API 계약은 [`backend-spec.md`](./backend-spec.md) 참조.

---

## 3계층 토큰 모델

TrustBite에서 "토큰"은 목적이 다른 3개 층으로 나뉜다. 섞이면 설계가 복잡해지므로 명확히 분리한다.

| 층 | 무엇 | 담당 역할 | 비고 |
|---|---|---|---|
| ① NextAuth 세션 (쿠키 JWT) | 우리 서비스의 로그인 상태 | **로그인 유지 전담** — 7일, 사용할 때마다 갱신(rolling) | 이게 "로그인 유지"의 실체 |
| ② Google access/refresh token | Google API를 대리 호출할 때 쓰는 출입증 | **우리는 미사용** | 구글 캘린더·드라이브 등 외부 Google API 호출 시에만 필요 |
| ③ 백엔드 accessToken | 우리 서비스 API(`/restaurants`, `/reviews` 등)의 출입증 | 로그인 사용자가 API 호출 시 `Authorization: Bearer`로 전달 | 30분. refreshToken(7일)으로 갱신 |

---

## 백엔드 토큰의 저장 위치와 호출 방식 (설계 결정)

### 저장: NextAuth JWT 안에만 둔다

세션 전략이 JWT(stateless)라 서버에 저장소가 없다. 사용자별로 요청 간 유지해야 하는 값을 둘 곳은 NextAuth JWT 토큰(암호화 쿠키)뿐이다. 백엔드 accessToken도 여기에 저장한다.

```
Google 로그인 성공
  → auth.ts 의 jwt 콜백에서 POST /api/auth/session/google 호출
  → 응답: { accessToken, refreshToken, needsOnboarding }
  → token.accessToken, token.refreshToken, token.accessTokenExpires 저장 (JWT 쿠키에 저장, 서버에서만 복호화)
```

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
- 로그인 유지는 ①(NextAuth 세션, 7일 rolling)이 담당한다. Google 토큰 만료와 무관하게 동작한다.

### Google 심사 부담도 없다

로그인에 필요한 scope(`openid` · `email` · `profile`)는 Google이 비민감(non-sensitive)으로 분류한다. 비민감 scope만 요청하면 Google 보안 심사(verification) 없이 앱을 프로덕션으로 게시할 수 있다. 설령 미래에 refresh token이 필요해지더라도 만료 문제가 없다.

---

## 세션 쿠키 생성 흐름 (NextAuth 내부)

세션 쿠키는 NextAuth가 자동으로 생성한다. 직접 만들 필요 없다.

```
1. Google 로그인 완료
        ↓
2. NextAuth가 jwt 콜백 호출
   → token.accessToken, token.needsOnboarding 등 저장
        ↓
3. NextAuth가 token을 AUTH_SECRET으로 암호화
   → httpOnly 쿠키(authjs.session-token)로 브라우저에 Set-Cookie
        ↓
4. 이후 모든 요청마다 브라우저가 쿠키 자동 전송
        ↓
5. 서버에서 getToken() 호출
   → 쿠키 읽어 복호화 → JWT payload(token.accessToken 등) 반환
```

`getToken()`은 네트워크 호출이 아니라 로컬 복호화다. `auth()`는 session 콜백까지 거치므로 `accessToken`을 꺼낼 수 없고, `getToken()`은 JWT 원본에 직접 접근하므로 서버 전용 필드도 읽을 수 있다.

---

## 백엔드 accessToken 수명 정책 — 확정

- **accessToken**: 30분. 브라우저에 노출하지 않음. JWT 내부 `exp` 클레임으로 만료 시각 파싱.
- **refreshToken**: 응답 body로 전달. 유효 기간 7일. NextAuth JWT(암호화 쿠키)에만 저장.

### Set-Cookie 방식을 채택하지 않은 이유

처음엔 백엔드가 refreshToken을 HttpOnly Set-Cookie로 발급하는 설계를 검토했다. 그러나 BFF 구조에서 다음 문제가 발견됐다.

```
jwt 콜백 (서버) → 백엔드 POST /api/auth/session/google
                       ↓ 응답: Set-Cookie: refreshToken=xxx
               받는 주체가 브라우저가 아니라 Next 서버의 fetch
               (fetch는 쿠키 저장소가 없어 그냥 버려짐)
                       ↓
           브라우저에 refreshToken 쿠키 없음
                       ↓
           갱신 시도 → 백엔드 "refreshToken이 없습니다" → 실패
```

쿠키는 응답을 직접 받은 주체만 저장한다. BFF에서 백엔드 응답을 받는 것은 브라우저가 아니라 Next 서버이므로, Set-Cookie가 자동으로는 브라우저에 도달하지 않는다.

**Set-Cookie forward 우회안 검토** — Next 서버가 Set-Cookie를 파싱해 `cookies().set()`으로 브라우저에 재전달하는 방식은 단계별로 가능 여부가 갈린다.

| 시점 | 가능 여부 | 이유 |
|---|---|---|
| 로그인 시 쿠키 심기 | ✅ | OAuth 콜백은 Route Handler — `cookies().set()` 허용 |
| 갱신 시 쿠키 읽기 | ✅ | `cookies()` 읽기는 RSC 렌더 중에도 허용 |
| 갱신 시 rotation된 새 refreshToken 저장 | ❌ | 갱신은 Server Component의 `auth()` 호출 중(RSC 렌더 중) 일어나 `cookies().set()` 불가 |

갱신 시점은 우리가 통제할 수 없으므로(렌더 중 `auth()` 호출이 트리거), 이 방식은 **refreshToken rotation을 포기해야만** 성립한다. 보안 수준은 body 방식과 동등한데(브라우저 저장 형태만 별도 쿠키 vs NextAuth JWT 내부 차이) rotation 포기 + Set-Cookie 파싱/forward 코드 비용을 추가로 내는 셈이다.

**결론**: refreshToken을 응답 body로 받아 NextAuth JWT에 함께 저장한다. NextAuth JWT 자체가 AUTH_SECRET으로 암호화된 httpOnly 쿠키이므로 보안 수준은 동등하고, rotation도 token 객체 갱신만으로 처리된다.

### 실제 구현 흐름

```
[최초 로그인]
Google 로그인 → jwt 콜백
  → POST /api/auth/session/google (idToken 전달)
  → 응답: { accessToken, refreshToken, needsOnboarding }
  → token.accessToken, token.refreshToken, token.accessTokenExpires, token.needsOnboarding 저장
  → NextAuth가 token을 AUTH_SECRET으로 암호화 → httpOnly 쿠키(authjs.session-token)로 브라우저에 전달

[세션 읽기 — accessToken 유효]
요청 → jwt 콜백
  → Date.now() < token.accessTokenExpires → token 그대로 반환

[세션 읽기 — accessToken 만료]
요청 → jwt 콜백
  → Date.now() >= token.accessTokenExpires
  → POST /api/auth/refresh (token.refreshToken 전달)
  → 성공: token.accessToken, token.refreshToken, token.accessTokenExpires 갱신
  → 실패(401): token.error = 'RefreshTokenExpired' → 재로그인 유도
```

### 미정 항목

- `POST /api/auth/logout` 명세 미확정 (refreshToken denylist 여부 포함).

---

## 온보딩 게이트 구현

### proxy.ts — 미들웨어 리다이렉트

Next.js 16에서 `middleware.ts`가 `proxy.ts`로 변경됨. `auth()`를 콜백으로 감싸면 `req.auth`로 세션에 접근 가능.

```
요청 → proxy.ts
  req.auth?.needsOnboarding === true  → /onboarding 리다이렉트
  req.auth가 있고 needsOnboarding === false, 현재 /onboarding  → / 리다이렉트
  그 외 → 통과
```

matcher에서 `api`, `_next/static`, `_next/image`, `favicon.ico`, `signin` 제외 — NextAuth 내부 Route Handler와 정적 파일 요청이 미들웨어를 거치지 않도록 함.

### auth.ts — 세션 업데이트

온보딩 완료 후 JWT 쿠키의 `needsOnboarding`을 갱신하려면 `unstable_update`를 사용.

```
Server Action에서 unstable_update({ needsOnboarding: false }) 호출
  → jwt 콜백 재실행 (trigger === 'update')
  → token.needsOnboarding = false
  → NextAuth가 JWT 쿠키 재암호화
  → 다음 요청부터 proxy.ts가 /onboarding 차단 해제
```

`jwt` 콜백에서 `trigger === 'update'`일 때 `session` 파라미터로 `unstable_update()`에 넘긴 값이 들어옴. 이 분기를 콜백 최상단에 두어 기존 로그인/갱신 로직과 분리.
