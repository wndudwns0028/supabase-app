# Development Guidelines

## 프로젝트 개요

- Next.js 15 App Router + Supabase 인증 스타터 키트
- 기술 스택: TypeScript, Tailwind CSS, shadcn/ui, @supabase/ssr
- 핵심 기능: 이메일/구글 OAuth 인증, 프로필 관리

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
app/
  actions/       # Server Action 파일 ("use server")
  auth/          # 인증 관련 페이지 및 라우트 핸들러
  protected/     # 인증 필수 페이지 (layout에서 세션 확인)
  instruments/   # DB 데이터 조회 예제
  layout.tsx     # 루트 레이아웃
  page.tsx       # 공개 랜딩 페이지
components/
  ui/            # shadcn/ui 컴포넌트 전용 폴더
  *.tsx          # 커스텀 컴포넌트
lib/
  supabase/
    server.ts    # Server Component/Action/Route Handler용 클라이언트
    client.ts    # Client Component용 클라이언트
    proxy.ts     # 미들웨어 역할 (세션 갱신)
  utils.ts       # 유틸리티 함수
types/
  supabase.ts    # Supabase CLI 자동 생성 DB 타입 (직접 수정 금지)
proxy.ts         # Next.js 미들웨어 진입점 (lib/supabase/proxy.ts 호출)
docs/            # PRD, ROADMAP, LEANCANVAS 문서
```

---

## 코드 표준

### 언어 규칙

- 주석: **반드시 한국어**로 작성
- 커밋 메시지: **반드시 한국어**로 작성 (Conventional Commits 형식)
- 문서: **반드시 한국어**로 작성
- 변수명/함수명/컴포넌트명: **반드시 영어** (camelCase, PascalCase)

### 포맷 규칙

- 들여쓰기: 2칸
- 네이밍: camelCase (변수/함수), PascalCase (컴포넌트/타입)
- Prettier + ESLint 자동 적용 (lint-staged via Husky)
- 커밋 전 `prettier --write` + `eslint --fix` 자동 실행됨

### 커밋 메시지 형식

```
feat: 새 기능 추가
fix: 버그 수정
refactor: 리팩토링
chore: 빌드/설정 변경
docs: 문서 수정
style: 코드 스타일 변경
test: 테스트 추가/수정
```

---

## Supabase 클라이언트 사용 규칙

### **클라이언트 선택 기준 (필수 준수)**

| 사용 위치                         | 사용할 파일                          |
| --------------------------------- | ------------------------------------ |
| Server Component                  | `lib/supabase/server.ts`             |
| Server Action (`app/actions/`)    | `lib/supabase/server.ts`             |
| Route Handler (`route.ts`)        | `lib/supabase/server.ts`             |
| Client Component (`"use client"`) | `lib/supabase/client.ts`             |
| 미들웨어 (`proxy.ts`)             | `lib/supabase/proxy.ts` 내 로직 사용 |

### **금지 사항**

- `server.ts`의 `createClient()`를 전역 변수에 저장 **금지** — 매 함수 호출마다 새 인스턴스 생성 필수
- `supabase.auth.getUser()` 사용 **금지** — 반드시 `supabase.auth.getClaims()` 사용
- `lib/supabase/proxy.ts`에서 `createServerClient`와 `supabase.auth.getClaims()` 사이에 코드 삽입 **금지**

### **올바른 사용 예시**

```typescript
// Server Action에서 올바른 패턴
export async function myAction() {
  const supabase = await createClient(); // 매번 새 인스턴스
  const { data: claims } = await supabase.auth.getClaims(); // getUser() 금지
  if (!claims) return { error: "인증이 필요합니다." };
  // ...
}
```

---

## Server Action 구현 규칙

- 파일 위치: `app/actions/` 디렉토리
- 파일 최상단에 `"use server"` 지시어 필수
- 참고 패턴: `app/actions/profile.ts`
- DB 조작 후 반드시 `revalidatePath()`로 캐시 갱신
- 에러 반환 형식: `{ error: "한국어 메시지" }` 또는 `{ success: true }`

---

## 타입 시스템 규칙

- `types/supabase.ts`는 **직접 수정 금지** — Supabase CLI로만 재생성
- DB 스키마 변경 후 반드시 타입 재생성:
  ```bash
  npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
  ```
- 테이블 타입 참조 방법:
  - Row 타입: `Tables<"profiles">`
  - Insert 타입: `TablesInsert<"profiles">`
  - Update 타입: `TablesUpdate<"profiles">`

### 현재 DB 스키마 (profiles 테이블)

| 컬럼       | 타입           | 비고              |
| ---------- | -------------- | ----------------- |
| id         | string         | auth.users FK, PK |
| email      | string \| null |                   |
| username   | string \| null | unique            |
| full_name  | string \| null |                   |
| bio        | string \| null |                   |
| website    | string \| null |                   |
| avatar_url | string \| null |                   |
| created_at | string         |                   |
| updated_at | string         |                   |

---

## 라우트 및 인증 흐름 규칙

### 라우트 구조

- `/` — 공개 (인증 불필요)
- `/auth/*` — 공개 (인증 불필요)
- `/login` — 공개 (인증 불필요)
- 그 외 모든 경로 — 인증 필수 (세션 없으면 `/auth/login`으로 리다이렉트)

### 새 보호 페이지 추가 시

- `app/protected/` 하위에 생성
- 별도 세션 확인 불필요 — `proxy.ts`가 자동 처리

### 새 공개 페이지 추가 시

- `proxy.ts` 내 인증 예외 경로에 추가 필요

---

## 컴포넌트 규칙

### shadcn/ui 컴포넌트

- 설치 명령: `npx shadcn@latest add <component>`
- 생성 위치: `components/ui/` (자동 생성됨, 직접 편집 가능)
- `components.json`이 shadcn 설정 파일 — 함부로 수정 금지

### 커스텀 컴포넌트

- 위치: `components/*.tsx`
- 하위 도메인별 폴더 분리 가능 (예: `components/auth/`, `components/profile/`)
- Server Component 기본, 상호작용 필요 시에만 `"use client"` 추가

---

## 환경 변수 규칙

- `.env.local` 파일에 정의 (`.gitignore`에 포함됨)
- **필수 변수:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `lib/utils.ts`의 `hasEnvVars`로 환경 변수 설정 여부 확인

---

## AI 의사결정 기준

### Supabase 클라이언트 선택

```
파일에 "use client" 있음? → lib/supabase/client.ts
Server Action ("use server")? → lib/supabase/server.ts
Route Handler (route.ts)? → lib/supabase/server.ts
Server Component? → lib/supabase/server.ts
proxy.ts 수정? → lib/supabase/proxy.ts 내 로직 참조
```

### 새 기능 추가 위치 결정

```
DB 조작 + 서버 전용 로직 → app/actions/ (Server Action)
페이지 UI → app/protected/ 또는 app/ (Page Component)
재사용 UI → components/
shadcn 컴포넌트 필요 → npx shadcn@latest add <name>
```

### 인증 관련 수정

```
미들웨어 로직 변경 → proxy.ts (루트) + lib/supabase/proxy.ts
인증 페이지 변경 → app/auth/*/page.tsx
폼 컴포넌트 변경 → components/*-form.tsx
```

---

## 금지 사항

- `supabase.auth.getUser()` 호출 **금지** (getClaims() 사용)
- `createClient()`를 전역/모듈 스코프에 저장 **금지**
- `lib/supabase/proxy.ts`에서 `createServerClient`와 `getClaims()` 사이 코드 삽입 **금지**
- `types/supabase.ts` 직접 편집 **금지**
- `components/ui/` 외부에 shadcn 컴포넌트 생성 **금지**
- 영어 주석 작성 **금지** (한국어 필수)
- Conventional Commits 형식을 벗어난 커밋 메시지 **금지**
- `--no-verify`로 Husky 훅 우회 **금지**
