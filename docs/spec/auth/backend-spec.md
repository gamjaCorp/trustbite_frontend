# 인증 — 백엔드 스펙

> 인증 화면·흐름 기획은 [`index.md`](./index.md) 참조. 토큰 구조·세션 정책은 [`token.md`](./token.md) 참조.

---

## 인증 방식

- **제공자**: Google OAuth 2.0 (현재 유일한 로그인 방법)
- **세션 전략**: JWT (서버에 세션 저장소 없음. 토큰에 사용자 상태를 보관)
- **accessToken 만료**: 30분. 만료 시 refreshToken으로 갱신.
- **refreshToken**: 서버가 HttpOnly 쿠키로 자동 발급·관리. 유효 기간 7일. JS에서 접근 불가.

---

## API 목록

| 엔드포인트 | 용도 | 호출 시점 |
|---|---|---|
| `POST /api/auth/session/google` | Google id_token 검증 후 서비스 토큰 발급 | Google OAuth 완료 직후 |
| `POST /api/auth/refresh` | accessToken 갱신 | accessToken 만료(401) 시 |
| `POST /users/me/onboarding` | 닉네임·프로필 사진 저장 | 온보딩 "시작하기" 버튼 클릭 시 |

---

## 엔드포인트 1 — `POST /api/auth/session/google`

Google OAuth 완료 직후 호출한다. 백엔드는 id_token을 검증하고 사용자를 등록(최초) 또는 조회(재로그인)한 뒤 서비스 토큰을 발급한다.

> **설계 결정**: refreshToken을 응답 body에 포함한다 (Set-Cookie 방식 불채택). BFF 구조에서 NextAuth jwt 콜백이 서버→서버로 호출하면 백엔드의 Set-Cookie 헤더가 브라우저까지 전달되지 않는 문제가 있어, body로 받아 NextAuth JWT(암호화 쿠키)에 저장하는 방식으로 확정.

### 요청

```
POST /api/auth/session/google
Content-Type: application/json
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `idToken` | string | Google OAuth에서 발급된 ID 토큰 |

### 응답 (200 OK)

| 필드 | 타입 | 설명 |
|---|---|---|
| `accessToken` | string | 서비스 전용 JWT (30분) |
| `refreshToken` | string | 갱신용 토큰 (7일) |
| `needsOnboarding` | boolean | `true`이면 온보딩 화면으로 이동 |

### 에러

| 상태 코드 | 의미 |
|---|---|
| `400` | 잘못된 요청 (유효하지 않은 토큰 등) |
| `401` | 인증 실패 |
| `500` | 서버 오류 |

---

## 엔드포인트 1-1 — `POST /api/auth/refresh`

accessToken 만료 시 호출한다. refreshToken을 body로 전달한다.

### 요청

```
POST /api/auth/refresh
Content-Type: application/json
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `refreshToken` | string | 발급받은 refresh 토큰 |

### 응답 (200 OK)

| 필드 | 타입 | 설명 |
|---|---|---|
| `accessToken` | string | 갱신된 서비스 JWT |
| `refreshToken` | string | 갱신된 refresh 토큰 |
| `needsOnboarding` | boolean | 항상 `false` |

### 에러

| 상태 코드 | 의미 |
|---|---|
| `401` | refreshToken 없음 또는 만료 → 재로그인 필요 |

---

## 엔드포인트 2 — `POST /users/me/onboarding`

온보딩 화면에서 닉네임 입력 후 "시작하기"를 누를 때 호출한다. 이후 같은 사용자가 다시 로그인해도 온보딩을 건너뛴다.

### 요청

```
POST /users/me/onboarding
Authorization: Bearer {accessToken}
Content-Type: application/json
```

| 필드 | 타입 | 제약 |
|---|---|---|
| `nickname` | string | 2~12자, 필수 |
| `avatarUrl` | string \| null | 프로필 사진 URL, 선택. null이면 Google 기본 사진 사용 |

> **프로필 사진 업로드 방식은 미정.** `avatarUrl`을 별도 이미지 업로드 endpoint로 먼저 올리고 URL만 전달하는 방식과 multipart 요청으로 한 번에 처리하는 방식 중 확정 필요. 현재는 필드 자리만 예약.

### 응답 (200 OK)

| 필드 | 타입 | 설명 |
|---|---|---|
| `user.id` | string | 사용자 ID |
| `user.name` | string | 저장된 닉네임 |
| `user.avatarUrl` | string \| null | 저장된 프로필 사진 URL |

### 에러

| 상태 코드 | 설명 |
|---|---|
| `400` | 유효성 실패 (닉네임 길이 등) |
| `401` | 인증 토큰 없음 또는 만료 |

---

## 공통 규약

- **Base URL**: 환경 변수 `BACKEND_API_URL` (서버 전용. 클라이언트에 노출 안 함)
- **인증 헤더**: 로그인 사용자 → `Authorization: Bearer {accessToken}`
- **에러 응답 형식**: `{ errorCode: string; errorMsg: string }` + HTTP 상태 코드

---

## 미정 항목

- **온보딩 완료 여부 판단 방법**: `needsOnboarding` 외에 닉네임 null 여부로도 판단 가능한지 확정 필요.
- **프로필 사진 업로드 방식**: 별도 이미지 업로드 endpoint 후 URL 전달 vs. onboarding endpoint에 multipart로 한 번에 전달. 용량 제한·허용 형식도 함께 확정 필요.
- **로그아웃 엔드포인트**: `POST /api/auth/logout` 명세 미확정 (refreshToken 쿠키 무효화 여부 포함).
- **서버측 라우트 보호 범위**: 미들웨어에서 가드해야 할 라우트 목록 확정 필요 (`/profile`, `/my-places`, `/review/*` 예상).
- **사용자 탈퇴**: 1차 MVP 범위 미정.
