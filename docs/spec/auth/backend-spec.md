# 인증 — 백엔드 스펙

> 인증 화면·흐름 기획은 [`index.md`](./index.md) 참조. 토큰 구조·세션 정책은 [`token.md`](./token.md) 참조.

---

## 인증 방식

- **제공자**: Google OAuth 2.0 (현재 유일한 로그인 방법)
- **세션 전략**: JWT (서버에 세션 저장소 없음. 토큰에 사용자 상태를 보관)
- **토큰 만료**: 30일

---

## API 목록

| 엔드포인트 | 용도 | 호출 시점 |
|---|---|---|
| `POST /auth/login` | Google 로그인 후 백엔드 사용자 등록/조회, 서비스 토큰 발급 | Google OAuth 완료 직후 |
| `POST /users/me/onboarding` | 닉네임·프로필 사진 저장 | 온보딩 "시작하기" 버튼 클릭 시 |

> **W4 연동 예정.** 현재 두 엔드포인트 모두 미연동 상태이며 Mock으로 동작 중.

---

## 엔드포인트 1 — `POST /auth/login`

Google OAuth가 완료된 직후 호출한다. 백엔드는 Google 사용자 정보를 받아 서비스 사용자를 생성(최초)하거나 조회(재로그인)한 뒤 서비스 전용 토큰을 발급한다.

### 요청

```
POST /auth/login
Content-Type: application/json
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `idToken` | string | Google OAuth에서 발급된 ID 토큰 |

### 응답 (200 OK)

| 필드 | 타입 | 설명 |
|---|---|---|
| `accessToken` | string | 서비스 전용 JWT |
| `isNewUser` | boolean | `true`이면 온보딩 화면으로 이동 |
| `user.id` | string | 서비스 내 사용자 ID |
| `user.name` | string \| null | 닉네임 (온보딩 전이면 null) |
| `user.image` | string \| null | Google 프로필 이미지 URL |

### 에러

| 상태 코드 | 설명 |
|---|---|
| `401` | idToken 검증 실패 |
| `500` | 서버 오류 |

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

- **Base URL**: 환경 변수 `NEXT_PUBLIC_API_BASE_URL`
- **인증 헤더**: 로그인 사용자 → `Authorization: Bearer {accessToken}`
- **에러 응답 형식**: `{ error: { code: string; message: string } }` + HTTP 상태 코드

---

## 미정 항목

- **온보딩 완료 여부 판단 방법**: `isNewUser` 플래그 외에 닉네임 null 여부로도 판단 가능한지 확정 필요.
- **프로필 사진 업로드 방식**: 별도 이미지 업로드 endpoint 후 URL 전달 vs. onboarding endpoint에 multipart로 한 번에 전달. 용량 제한·허용 형식도 함께 확정 필요.
- **백엔드 accessToken 수명 및 로그아웃·갱신 정책**: [`token.md`](./token.md)의 (A)/(B) 선택지를 백엔드 팀과 확정. 이 결정에 따라 `POST /auth/logout`(denylist) 필요 여부와 refreshToken 제공 여부가 함께 정해진다.
- **서버측 라우트 보호 범위**: 미들웨어에서 가드해야 할 라우트 목록 확정 필요 (`/profile`, `/my-places`, `/review/*` 예상).
- **사용자 탈퇴**: 1차 MVP 범위 미정.
