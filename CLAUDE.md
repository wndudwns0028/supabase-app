# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

### Supabase 타입 생성

DB 스키마 변경 후 타입을 재생성해야 할 경우:

```bash
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
```

## 환경 변수

`.env.local` 파일에 다음 변수가 필요하다:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## 아키텍처

Next.js 15 App Router + Supabase 인증 스타터 키트. `@supabase/ssr` 패키지로 쿠키 기반 세션을 관리한다.

### 라우트 구조

- `/` — 공개 랜딩 페이지
- `/auth/*` — 인증 관련 페이지 (login, sign-up, forgot-password, update-password, confirm, error)
- `/protected/*` — 인증 필수 페이지 (layout에서 세션 확인)
- `/instruments` — DB 데이터 조회 예제 페이지

### Supabase 클라이언트

용도에 따라 다른 클라이언트를 사용해야 한다:

| 파일                     | 사용 위치                                      |
| ------------------------ | ---------------------------------------------- |
| `lib/supabase/server.ts` | Server Component, Server Action, Route Handler |
| `lib/supabase/client.ts` | Client Component (`"use client"`)              |
| `lib/supabase/proxy.ts`  | `proxy.ts` (미들웨어 역할) — 세션 갱신 처리    |

**주의:** `server.ts`의 `createClient()`는 Fluid compute 대비 매 호출마다 새 인스턴스를 생성해야 한다. 전역 변수에 저장하지 말 것.

### 인증 흐름

`proxy.ts`가 Next.js 미들웨어 역할을 한다. `/`, `/login`, `/auth/*` 경로를 제외한 모든 요청에서 세션이 없으면 `/auth/login`으로 리다이렉트된다.

세션 확인은 `supabase.auth.getClaims()`를 사용한다 (`getUser()` 대신). `getClaims()` 호출 전에 코드를 삽입하면 세션이 무작위로 끊기는 버그가 생길 수 있다.

### Server Action 패턴

`app/actions/` 디렉토리에 `"use server"` 지시어를 사용. `app/actions/profile.ts`가 참고 패턴이다:

- `createClient()`로 서버 클라이언트 생성
- `supabase.auth.getClaims()`로 현재 유저 확인
- DB 조작 후 `revalidatePath()`로 캐시 갱신

### 타입 시스템

`types/supabase.ts`는 Supabase CLI로 자동 생성된 DB 타입이다. `Tables<"profiles">`, `TablesUpdate<"profiles">` 등의 헬퍼 타입으로 테이블 row/insert/update 타입을 참조한다.

### DB 스키마

현재 `profiles` 테이블: `id` (auth.users FK), `email`, `username` (unique), `full_name`, `bio`, `website`, `avatar_url`, `created_at`, `updated_at`
