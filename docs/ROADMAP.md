# 소모임 이벤트 관리 MVP — 개발 로드맵

소모임 주최자가 공지·참여자 관리·정산 업무를 카카오톡 없이 한 곳에서 처리할 수 있는 서비스

---

## 개요

수영·헬스·탁구 등 정기 소모임을 운영하는 주최자(organizer)와 참여 멤버(member)를 위한 이벤트 관리 플랫폼으로, 다음 기능을 제공합니다.

- **팀 공간 관리**: 팀 생성·초대 링크·멤버 관리·팀 설정 (F001, F002, F012)
- **이벤트 공지**: 이벤트 생성·수정·공개 공유·참여 신청/취소·대기자 자동 승격 (F003, F004, F005, F006, F007)
- **정산 자동화**: 1/N 자동 분배·납부 현황 추적·완료 처리 (F008, F009)
- **대시보드**: 내 팀 목록과 다가오는 이벤트 요약 (F010)
- **인증**: 이메일/비밀번호 + Google OAuth (F011, 이미 완료)

---

## 진행 상태 범례

| 기호 | 의미    |
| ---- | ------- |
| ✅   | 완료    |
| 🚧   | 진행 중 |
| ⬜   | 미시작  |

---

## 개발 워크플로우

1. **UI/UX 우선 구현** — 더미 데이터로 전체 페이지 UI를 먼저 구현한다. Supabase 연동 없이 화면 흐름·레이아웃·컴포넌트를 빠르게 검증하고 보완한다.
2. **DB 및 API 연동** — UI가 확정된 후 Supabase DB 스키마와 서버 액션을 구현하여 실제 데이터와 연동한다.
3. **테스트** — API/비즈니스 로직 Task에는 "## 테스트 체크리스트" 섹션(Playwright MCP 시나리오)을 반드시 포함한다.
4. **로드맵 업데이트** — 완료된 Task를 ✅로 표시하고 Phase 전체 완료 시 Phase 제목에도 ✅를 추가한다.

---

## 개발 단계

---

### Phase 0: 기반 환경 구축 ✅

인증 스타터 키트 세팅 및 Google OAuth 연동이 완료된 상태입니다.

#### TASK-001: 프로젝트 초기 설정 및 인증 구현 ✅

> **기능 ID:** F011 | **상태:** ✅ 완료

- ✅ Next.js 15 App Router + TypeScript + TailwindCSS v4 + shadcn/ui 초기 설정
- ✅ Supabase 프로젝트 연동 (`@supabase/ssr` 쿠키 기반 세션)
- ✅ 이메일/비밀번호 로그인·회원가입 폼 구현
- ✅ Google OAuth 로그인 버튼 구현
- ✅ `proxy.ts` 미들웨어 — 비인증 요청 `/auth/login` 리디렉션
- ✅ `profiles` 테이블 및 Supabase 타입 생성(`types/supabase.ts`)
- ✅ ESLint·Prettier·Husky·commitlint 개발 도구 설정

**관련 파일/경로**

```
app/auth/login/
app/auth/sign-up/
app/auth/forgot-password/
app/auth/update-password/
app/auth/callback/
app/auth/confirm/
app/auth/error/
components/login-form.tsx
components/sign-up-form.tsx
components/forgot-password-form.tsx
components/update-password-form.tsx
lib/supabase/server.ts
lib/supabase/client.ts
proxy.ts
types/supabase.ts
```

---

### Phase 1: 전체 UI/UX 구현 (더미 데이터 기반) ✅

**완료 기준:** 더미 데이터로 전체 페이지 UI/UX 구현 완료, Supabase 연동 없이 화면 흐름 전체 검증 가능

> **참고:** 이 Phase의 모든 Task는 실제 DB 연동 없이 `lib/dummy-data.ts`의 더미 데이터만 사용한다. 서버 액션 파일은 빈 스텁(stub)으로만 생성한다.

---

#### TASK-002: 타입 정의 및 프로젝트 구조 설계 ⬜

> **기능 ID:** F001, F002, F003, F004, F010 (타입 기반) | **상태:** ⬜ 미시작

- 도메인 TypeScript 인터페이스 정의 (`types/domain.ts`)
  - `Team`, `TeamMember`, `Event`, `EventParticipant`, `Settlement`, `SettlementItem`
  - `SportType`, `EventStatus`, `ParticipantStatus`, `PaidStatus` 열거형
- 공통 유틸리티 타입 (`types/common.ts`) — `ApiResponse<T>`, `PaginatedResponse<T>`
- 전체 라우트 골격 파일 생성 (빈 `page.tsx`, `layout.tsx`)
  - `app/(dashboard)/dashboard/page.tsx`
  - `app/(dashboard)/teams/new/page.tsx`
  - `app/(dashboard)/teams/[teamId]/page.tsx`
  - `app/(dashboard)/teams/[teamId]/settings/page.tsx`
  - `app/(dashboard)/teams/[teamId]/members/page.tsx`
  - `app/(dashboard)/teams/[teamId]/events/new/page.tsx`
  - `app/(dashboard)/teams/[teamId]/events/[eventId]/page.tsx`
  - `app/(dashboard)/teams/[teamId]/events/[eventId]/edit/page.tsx`
  - `app/(dashboard)/teams/[teamId]/events/[eventId]/participants/page.tsx`
  - `app/(dashboard)/teams/[teamId]/events/[eventId]/settlement/page.tsx`
  - `app/(dashboard)/teams/[teamId]/events/[eventId]/settlement/new/page.tsx`
  - `app/events/[eventId]/page.tsx` (공개 공유)
  - `app/join/[token]/page.tsx` (팀 초대 수락)
- 공통 레이아웃 골격 — 인증 후 상단 내비게이션, 팀 사이드바
- `app/actions/` 빈 스텁 파일 생성 (`teams.ts`, `events.ts`, `participants.ts`, `settlements.ts`)
- 더미 데이터 유틸리티 (`lib/dummy-data.ts`) — 전체 Phase 1 UI 검증용

**관련 파일/경로**

```
types/domain.ts
types/common.ts
app/(dashboard)/layout.tsx
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/teams/
app/events/[eventId]/page.tsx
app/join/[token]/page.tsx
app/actions/teams.ts
app/actions/events.ts
app/actions/participants.ts
app/actions/settlements.ts
lib/dummy-data.ts
```

---

#### TASK-003: 공통 UI 컴포넌트 구현 ⬜

> **기능 ID:** 전체 공통 | **상태:** ⬜ 미시작

- shadcn/ui 추가 컴포넌트 설치 (`form`, `select`, `badge`, `tabs`, `avatar`, `toast`, `date-picker`, `dialog`)
- React Hook Form + Zod 패키지 설치 및 공통 폼 래퍼 컴포넌트
- 공통 레이아웃 컴포넌트 구현
  - `components/layout/top-nav.tsx` — 로그인 사용자 상단 내비게이션 (대시보드·팀 만들기·프로필)
  - `components/layout/team-sidebar.tsx` — 팀 내부 사이드바 (팀 홈·멤버 관리·팀 설정)
  - `components/layout/page-header.tsx` — 페이지 제목 + 브레드크럼
- 공통 피드백 컴포넌트
  - `components/ui/empty-state.tsx` — 데이터 없음 안내
  - `components/ui/loading-spinner.tsx` — 로딩 스피너
  - `components/ui/status-badge.tsx` — 이벤트/납부 상태 배지

**관련 파일/경로**

```
components/layout/top-nav.tsx
components/layout/team-sidebar.tsx
components/layout/page-header.tsx
components/ui/empty-state.tsx
components/ui/loading-spinner.tsx
components/ui/status-badge.tsx
```

---

#### TASK-004: 대시보드 페이지 UI 구현 ⬜

> **기능 ID:** F010 | **상태:** ⬜ 미시작

- 내가 속한 팀 목록 카드 컴포넌트 (팀명, 종목 아이콘, 내 역할 배지) — 더미 데이터
- 다가오는 이벤트 요약 리스트 (날짜, 팀명, 참여 상태) — 더미 데이터
- 팀 없을 때 온보딩 안내 문구 + "팀 만들기" 유도 버튼
- 반응형 그리드 레이아웃 (모바일/데스크톱)

**관련 파일/경로**

```
app/(dashboard)/dashboard/page.tsx
components/dashboard/team-card.tsx
components/dashboard/upcoming-event-item.tsx
components/dashboard/onboarding-empty.tsx
```

---

#### TASK-005: 팀 생성 페이지 UI 구현 ⬜

> **기능 ID:** F001 | **상태:** ⬜ 미시작

- 팀 이름 입력 필드 (필수, 최대 50자, Zod 검증)
- 팀 설명 입력 필드 (선택)
- 종목 선택 셀렉트 (수영·헬스·탁구·기타)
- React Hook Form 기반 폼 유효성 검사
- 인라인 에러 메시지 표시
- "팀 만들기" 제출 버튼 (로딩 상태 포함)

**관련 파일/경로**

```
app/(dashboard)/teams/new/page.tsx
components/teams/team-form.tsx
lib/validations/team.ts
```

---

#### TASK-006: 팀 홈 페이지 UI 구현 ⬜

> **기능 ID:** F003, F010 | **상태:** ⬜ 미시작

- 팀명 + 종목 헤더 영역 — 더미 데이터
- 이벤트 목록 탭 (예정 / 완료 / 취소)
- 이벤트 카드 컴포넌트 (제목, 날짜, 장소, 참여 현황 n/max, 상태 배지)
- "이벤트 만들기" 버튼 (organizer 전용 — 더미 역할 분기 확인)
- 이벤트 없을 때 빈 상태 안내

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/page.tsx
components/events/event-card.tsx
components/events/event-list-tabs.tsx
```

---

#### TASK-007: 이벤트 생성·수정 페이지 UI 구현 ⬜

> **기능 ID:** F003 | **상태:** ⬜ 미시작

- 제목·설명·장소 입력 필드
- 시작/종료 일시 선택 (DateTimePicker — shadcn/ui Calendar 활용)
- 최대 참여 인원 입력 (0 = 무제한 체크박스 연동)
- 참가비 입력 (0원 가능)
- 상태 선택 셀렉트 (`draft` / `open`)
- 이벤트 수정 페이지: 기존 값 preload 처리 구조 설계 (더미 데이터 채움)
- 이벤트 상태 변경 옵션 (`open` → `closed` / `cancelled`)
- React Hook Form + Zod 검증, 인라인 에러 표시

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/events/new/page.tsx
app/(dashboard)/teams/[teamId]/events/[eventId]/edit/page.tsx
components/events/event-form.tsx
lib/validations/event.ts
```

---

#### TASK-008: 이벤트 상세 페이지 UI 구현 ⬜

> **기능 ID:** F005, F006 | **상태:** ⬜ 미시작

- 이벤트 상세 정보 (제목, 일시, 장소, 참가비, 설명) — 더미 데이터
- 참여 현황 (확정 n명 / 최대 n명, 대기 n명)
- "참여 신청" / "신청 취소" 버튼 (더미 상태에 따른 전환 표시)
- 정원 초과 시 자동 대기 등록 안내 텍스트
- "공유 링크 복사" 버튼
- organizer 전용 버튼 노출 ("수정", "참여자 관리", "정산") — 더미 역할 분기 확인

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/events/[eventId]/page.tsx
components/events/event-detail-header.tsx
components/events/participation-status.tsx
components/events/participant-action-button.tsx
```

---

#### TASK-009: 이벤트 공개 공유 페이지 UI 구현 ⬜

> **기능 ID:** F004, F005 | **상태:** ⬜ 미시작

- 이벤트 상세 정보 읽기 전용 표시 — 더미 데이터
- 참여 현황 (확정/대기 인원)
- 비로그인 상태: "로그인 후 참여 신청" 버튼 (더미 분기 확인)
- 로그인 상태 멤버: "참여 신청" / "신청 취소" 버튼 활성화
- SEO 메타데이터 구조 설계 (`generateMetadata`)

**관련 파일/경로**

```
app/events/[eventId]/page.tsx
components/events/public-event-view.tsx
```

---

#### TASK-010: 참여자 관리 페이지 UI 구현 ⬜

> **기능 ID:** F006, F007 | **상태:** ⬜ 미시작

- 참여자 탭별 목록 UI (확정 / 대기 / 취소) — 더미 데이터
- 대기자 수동 확정 버튼 (정원 초과 시 비활성화 상태 표시)
- 참여자 강제 취소 버튼
- 각 참여자 note 표시
- "완료" 버튼 → 이벤트 상세 페이지 복귀 링크
- organizer 전용 접근 레이아웃 구조 설계

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/events/[eventId]/participants/page.tsx
components/participants/participant-list-tabs.tsx
components/participants/participant-action-row.tsx
```

---

#### TASK-011: 팀 멤버 관리 페이지 UI 구현 ⬜

> **기능 ID:** F002 | **상태:** ⬜ 미시작

- 멤버 목록 (이름, 역할, 합류일) — 더미 데이터
- 초대 링크 표시 박스 및 "링크 복사" 버튼 UI
- "초대 링크 갱신" 버튼 UI (organizer 전용 — 더미 역할 분기 확인)

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/members/page.tsx
components/teams/member-list.tsx
components/teams/invite-link-box.tsx
```

---

#### TASK-012: 팀 초대 수락 페이지 UI 구현 ⬜

> **기능 ID:** F002 | **상태:** ⬜ 미시작

- 초대 대상 팀 정보 표시 (팀명, 종목) — 더미 데이터
- 이미 멤버인 경우 안내 메시지 + 팀 홈 이동 버튼 UI
- "팀 합류" 버튼 UI
- 비로그인 시 리디렉션 레이아웃 구조 설계

**관련 파일/경로**

```
app/join/[token]/page.tsx
components/teams/join-team-view.tsx
```

---

#### TASK-013: 팀 설정 페이지 UI 구현 ⬜

> **기능 ID:** F012 | **상태:** ⬜ 미시작

- 팀 이름·설명·종목 수정 폼 — 더미 데이터로 preload
- "저장" 버튼 (로딩 상태 포함)
- organizer 전용 접근 레이아웃 구조 설계

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/settings/page.tsx
components/teams/team-settings-form.tsx
```

---

#### TASK-014: 정산 생성 페이지 UI 구현 ⬜

> **기능 ID:** F008 | **상태:** ⬜ 미시작

- 총비용 입력 필드 (Zod 검증 — 양의 정수)
- 메모 입력 필드 (선택)
- 확정 참여자 수 기반 1/N 자동 계산 미리보기 (더미 인원 수 기준, 실시간 업데이트)
- 나머지 금액은 주최자에게 합산하는 방식 안내 텍스트
- "정산 생성" 버튼

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/events/[eventId]/settlement/new/page.tsx
components/settlements/settlement-form.tsx
components/settlements/amount-preview.tsx
lib/validations/settlement.ts
```

---

#### TASK-015: 정산 현황 페이지 UI 구현 ⬜

> **기능 ID:** F009 | **상태:** ⬜ 미시작

- 총비용 / 인당 금액 / 정산 상태 표시 — 더미 데이터
- 참가자별 납부 현황 목록 (이름, 금액, 납부 상태, 납부일)
- organizer 전용 "납부 확인" 토글 버튼
- 전원 납부 완료 시 "정산 완료" 처리 버튼 활성화 UI
- 정산 미생성 시 organizer에게 "정산 만들기" 버튼 표시

**관련 파일/경로**

```
app/(dashboard)/teams/[teamId]/events/[eventId]/settlement/page.tsx
components/settlements/settlement-status-view.tsx
components/settlements/settlement-item-row.tsx
```

---

#### TASK-016: 관리자 페이지 레이아웃 + 개요 대시보드 UI 구현 ✅

> **기능 ID:** F-ADMIN | **상태:** ✅ 완료

- ✅ 어드민 전용 더미 데이터 4종 추가 (`lib/dummy-data.ts`) — AdminUser, AdminTeam, AdminEvent, AdminSettlement
- ✅ `app/(admin)/layout.tsx` — 어드민 레이아웃 (좌측 사이드바 + 로그인 체크, TODO: is_admin 체크)
- ✅ `components/admin/admin-sidebar.tsx` — 좌측 내비게이션 (개요/유저/팀/이벤트/정산)
- ✅ `components/admin/stats-card.tsx` — 통계 카드 컴포넌트 (아이콘 + 라벨 + 숫자)
- ✅ `app/(admin)/admin/page.tsx` — 개요 대시보드 (통계 카드 4개 + 최근 유저/팀 목록)

**관련 파일/경로**

```
app/(admin)/layout.tsx
app/(admin)/admin/page.tsx
components/admin/admin-sidebar.tsx
components/admin/stats-card.tsx
lib/dummy-data.ts
```

---

#### TASK-017: 관리자 유저·팀·이벤트·정산 목록 페이지 UI 구현 ✅

> **기능 ID:** F-ADMIN | **상태:** ✅ 완료

- ✅ `app/(admin)/admin/users/page.tsx` + `components/admin/users-table.tsx` — 유저 목록 (이메일/이름/가입일/팀 수, 클라이언트 사이드 검색)
- ✅ `app/(admin)/admin/teams/page.tsx` + `components/admin/teams-table.tsx` — 팀 목록 (팀명/종목/멤버수/이벤트수, 종목 필터)
- ✅ `app/(admin)/admin/events/page.tsx` + `components/admin/events-table.tsx` — 이벤트 목록 (이벤트명/팀명/일시/참여현황/상태, 상태 탭 필터)
- ✅ `app/(admin)/admin/settlements/page.tsx` + `components/admin/settlements-table.tsx` — 정산 목록 (이벤트명/팀명/총금액/납부현황/상태, 상태 탭 필터)

**관련 파일/경로**

```
app/(admin)/admin/users/page.tsx
app/(admin)/admin/teams/page.tsx
app/(admin)/admin/events/page.tsx
app/(admin)/admin/settlements/page.tsx
components/admin/users-table.tsx
components/admin/teams-table.tsx
components/admin/events-table.tsx
components/admin/settlements-table.tsx
```

---

### Phase 2: DB 구축 + API 연동 — 팀 + 이벤트 ✅

**완료 기준:** 팀 생성 → 이벤트 생성 → 공유 링크 전달 동작 확인

---

#### TASK-018: DB 스키마 생성 및 RLS 정책 설정 (teams, team_members, events) ✅

> **기능 ID:** F001, F003 (데이터 계층) | **상태:** ✅ 완료

- ✅ Supabase 마이그레이션 파일 작성 및 적용
  - ✅ `teams` 테이블 생성 (`id`, `name`, `description`, `sport_type`, `invite_token`, `created_by`, `created_at`, `updated_at`)
  - ✅ `team_members` 테이블 생성 (`id`, `team_id`, `user_id`, `role`, `joined_at`)
  - ✅ `events` 테이블 생성 (`id`, `team_id`, `created_by`, `title`, `description`, `location`, `starts_at`, `ends_at`, `max_participants`, `entry_fee`, `status`, `created_at`, `updated_at`)
- ✅ RLS 정책 설정
  - ✅ `teams`: 멤버만 조회, 생성자만 수정/삭제
  - ✅ `team_members`: 팀 멤버만 조회, 본인 레코드만 삽입/삭제
  - ✅ `events`: 팀 멤버만 조회, organizer만 생성/수정/삭제, 공개 이벤트는 비인증 조회 허용
- ✅ `invite_token` unique 인덱스 생성
- ✅ Supabase CLI로 TypeScript 타입 재생성 (`types/supabase.ts`)

**관련 파일/경로**

```
supabase/migrations/YYYYMMDD_phase2_schema.sql
types/supabase.ts
```

**테스트 체크리스트**

- [x] Supabase 대시보드에서 테이블 생성 확인
- [x] RLS 정책 — 비인증 사용자 teams 조회 차단 확인
- [x] RLS 정책 — organizer가 아닌 멤버의 이벤트 수정 차단 확인
- [x] `invite_token` 유니크 제약 조건 동작 확인

---

#### TASK-019: 팀 서버 액션 + 대시보드 API 연동 ✅

> **기능 ID:** F001, F010 | **상태:** ✅ 완료

- ✅ `app/actions/teams.ts` 서버 액션 구현
  - ✅ `createTeam(formData)` — 팀 생성, `invite_token` 자동 발급 (`crypto.randomUUID()`)
  - ✅ `getMyTeams()` — 내가 속한 팀 목록 조회
  - ✅ `getTeamById(teamId)` — 팀 상세 조회 (멤버 권한 확인)
- ✅ 대시보드 페이지 더미 데이터 → 실제 Supabase 데이터 교체
- ✅ 팀 생성 폼 실제 저장 연동, 성공 후 팀 홈 페이지로 리디렉션
- ✅ 에러 핸들링 및 toast 알림

**관련 파일/경로**

```
app/actions/teams.ts
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/teams/new/page.tsx
```

**테스트 체크리스트**

- [x] Playwright: 로그인 후 팀 생성 → 팀 홈 페이지 리디렉션 확인
- [x] Playwright: 대시보드에서 생성된 팀 카드 표시 확인
- [x] Playwright: 팀 이름 필수 검증 — 빈 값 제출 시 에러 메시지 표시 확인
- [x] Playwright: 팀 생성 후 `invite_token` DB 자동 생성 확인
- [x] RLS 검증: 다른 사용자의 팀이 내 대시보드에 노출되지 않는지 확인

---

#### TASK-020: 이벤트 서버 액션 + 팀 홈 API 연동 ✅

> **기능 ID:** F003, F004 | **상태:** ✅ 완료

- ✅ `app/actions/events.ts` 서버 액션 구현
  - ✅ `createEvent(teamId, formData)` — 이벤트 생성 (organizer 권한 확인)
  - ✅ `updateEvent(eventId, formData)` — 이벤트 수정 (organizer 권한 확인)
  - ✅ `getEventsByTeam(teamId)` — 팀 이벤트 목록 조회
  - ✅ `getEventById(eventId)` — 이벤트 상세 조회 (공개 접근 지원)
- ✅ 팀 홈·이벤트 상세·이벤트 생성·수정 페이지 더미 데이터 → 실제 데이터 교체
- ✅ 이벤트 공개 공유 페이지 — 비인증 Supabase 클라이언트로 공개 조회 연동
- ✅ `revalidatePath()` 적용으로 서버 캐시 갱신

**관련 파일/경로**

```
app/actions/events.ts
app/(dashboard)/teams/[teamId]/page.tsx
app/(dashboard)/teams/[teamId]/events/new/page.tsx
app/(dashboard)/teams/[teamId]/events/[eventId]/edit/page.tsx
app/events/[eventId]/page.tsx
```

**테스트 체크리스트**

- [x] Playwright: organizer로 이벤트 생성 → 팀 홈 목록에 표시 확인
- [x] Playwright: 이벤트 수정 후 상세 페이지 데이터 갱신 확인
- [x] Playwright: 비로그인 상태로 공개 공유 URL 접근 → 이벤트 정보 조회 확인
- [x] Playwright: member 계정으로 이벤트 생성 시도 → 403 또는 리디렉션 확인
- [x] RLS 검증: 다른 팀의 이벤트 조회 차단 확인

---

### Phase 3: DB 구축 + API 연동 — 참여 신청 + 멤버 관리

**완료 기준:** 공유 링크 → 신청 → 대기 → 주최자 확정 흐름 완성

---

#### TASK-021: DB 스키마 생성 및 RLS 정책 설정 (event_participants) ⬜

> **기능 ID:** F005, F006, F007 (데이터 계층) | **상태:** ⬜ 미시작

- `event_participants` 테이블 생성
  - `id`, `event_id`, `user_id`, `status`(`confirmed`/`waitlisted`/`cancelled`), `note`, `created_at`, `updated_at`
  - `(event_id, user_id)` 유니크 제약 조건
- RLS 정책 설정
  - `event_participants`: 팀 멤버만 조회, 본인 레코드 삽입/수정, organizer는 모든 레코드 수정 가능
- 대기자 자동 승격 DB 트리거 설계
  - `confirmed` → `cancelled` 상태 변경 시 `waitlisted` 1번을 `confirmed`로 자동 전환
- Supabase 타입 재생성

**관련 파일/경로**

```
supabase/migrations/YYYYMMDD_phase3_participants.sql
types/supabase.ts
```

**테스트 체크리스트**

- [ ] Supabase 대시보드에서 `event_participants` 테이블 생성 확인
- [ ] `(event_id, user_id)` 유니크 제약 — 중복 신청 차단 확인
- [ ] 트리거 동작: `confirmed` 취소 시 `waitlisted` 1번 자동 `confirmed` 전환 확인
- [ ] RLS: 본인 참여 레코드만 수정 가능 확인

---

#### TASK-022: 참여 신청·취소 서버 액션 + 이벤트 상세 연동 ⬜

> **기능 ID:** F005, F006 | **상태:** ⬜ 미시작

- `app/actions/participants.ts` 서버 액션 구현
  - `applyToEvent(eventId)` — 참여 신청 (정원 확인 → `confirmed` 또는 `waitlisted` 결정)
  - `cancelParticipation(eventId)` — 참여 취소 (대기자 자동 승격 트리거 연동)
  - `getParticipantsByEvent(eventId)` — 참여자 목록 조회 (상태별)
- 이벤트 상세 페이지 참여 신청/취소 버튼 실제 액션 연동
- 이벤트 공개 공유 페이지 참여 신청 연동 (로그인 후 복귀 처리)
- 정원 초과 시 자동 대기 등록 안내 toast 메시지

**관련 파일/경로**

```
app/actions/participants.ts
app/(dashboard)/teams/[teamId]/events/[eventId]/page.tsx
app/events/[eventId]/page.tsx
```

**테스트 체크리스트**

- [ ] Playwright: 정원 내 참여 신청 → `confirmed` 상태 확인
- [ ] Playwright: 정원 초과 후 신청 → `waitlisted` 상태 + 대기 안내 toast 확인
- [ ] Playwright: 확정자 취소 → 대기 1번 자동 `confirmed` 승격 확인
- [ ] Playwright: 비로그인 공개 공유 페이지에서 "로그인 후 참여 신청" 클릭 → 로그인 후 이벤트 페이지 복귀 확인
- [ ] Playwright: 중복 신청 시도 → 에러 메시지 표시 확인

---

#### TASK-023: 참여자 관리 페이지 API 연동 ⬜

> **기능 ID:** F006, F007 | **상태:** ⬜ 미시작

- `app/actions/participants.ts` 추가 액션 구현
  - `confirmParticipant(participantId)` — 대기자 수동 확정 (organizer 전용, 정원 확인)
  - `forceCancel(participantId)` — 참여자 강제 취소 (대기 1번 자동 승격 연동)
- 참여자 관리 페이지 더미 데이터 → 실제 데이터 교체
- 정원 초과 시 수동 확정 버튼 비활성화 로직 연동
- organizer 권한 서버 사이드 검증

**관련 파일/경로**

```
app/actions/participants.ts
app/(dashboard)/teams/[teamId]/events/[eventId]/participants/page.tsx
```

**테스트 체크리스트**

- [ ] Playwright: organizer가 대기자를 수동 확정 → 확정 탭으로 이동 확인
- [ ] Playwright: 정원 꽉 찬 상태에서 수동 확정 버튼 비활성화 확인
- [ ] Playwright: organizer가 확정자 강제 취소 → 대기 1번 자동 승격 확인
- [ ] Playwright: member 계정으로 참여자 관리 페이지 접근 → 리디렉션 확인

---

#### TASK-024: 팀 멤버 관리 페이지 API 연동 ⬜

> **기능 ID:** F002 | **상태:** ⬜ 미시작

- `app/actions/teams.ts` 추가 액션 구현
  - `getTeamMembers(teamId)` — 팀 멤버 목록 조회
  - `regenerateInviteToken(teamId)` — 초대 링크 갱신 (organizer 전용)
- 팀 멤버 관리 페이지 더미 데이터 → 실제 데이터 교체
- "링크 복사" 버튼 클립보드 기능 + toast 연동
- "초대 링크 갱신" 버튼 실제 액션 연동

**관련 파일/경로**

```
app/actions/teams.ts
app/(dashboard)/teams/[teamId]/members/page.tsx
```

**테스트 체크리스트**

- [ ] Playwright: 초대 링크 복사 버튼 클릭 → 클립보드 저장 + toast 확인
- [ ] Playwright: organizer가 초대 링크 갱신 → 새 토큰 즉시 반영 확인
- [ ] Playwright: 기존 토큰으로 초대 링크 접근 → 유효하지 않은 토큰 에러 확인

---

#### TASK-025: 팀 초대 수락 페이지 API 연동 ⬜

> **기능 ID:** F002 | **상태:** ⬜ 미시작

- `app/actions/teams.ts` 추가 액션 구현
  - `joinTeamByToken(token)` — 토큰 유효성 검증 후 `team_members` 레코드 생성
- 팀 초대 수락 페이지 더미 데이터 → 실제 토큰 기반 데이터 교체
- 비로그인 시 로그인 페이지 리디렉션 (return URL 보존) 연동
- 합류 성공 시 대시보드로 이동

**관련 파일/경로**

```
app/actions/teams.ts
app/join/[token]/page.tsx
```

**테스트 체크리스트**

- [ ] Playwright: 유효한 토큰으로 접근 → 팀 정보 표시 → "팀 합류" 클릭 → 대시보드 이동 확인
- [ ] Playwright: 비로그인 상태로 초대 링크 접근 → 로그인 후 동일 URL 복귀 확인
- [ ] Playwright: 이미 멤버인 계정으로 접근 → 안내 메시지 + 팀 홈 버튼 표시 확인
- [ ] Playwright: 유효하지 않은 토큰 → 에러 메시지 표시 확인

---

#### TASK-026: 팀 설정 페이지 API 연동 ⬜

> **기능 ID:** F012 | **상태:** ⬜ 미시작

- `app/actions/teams.ts` 추가 액션 구현
  - `updateTeam(teamId, formData)` — 팀 정보 수정 (organizer 권한 확인)
- 팀 설정 페이지 더미 데이터 → 실제 데이터 교체 (기존 값 preload)
- organizer가 아닌 경우 서버 사이드 권한 확인 후 대시보드 리디렉션

**관련 파일/경로**

```
app/actions/teams.ts
app/(dashboard)/teams/[teamId]/settings/page.tsx
```

**테스트 체크리스트**

- [ ] Playwright: organizer가 팀 이름 수정 → 팀 홈 페이지에서 변경된 이름 확인
- [ ] Playwright: member 계정으로 팀 설정 페이지 접근 → 대시보드 리디렉션 확인

---

#### TASK-027: Phase 3 통합 테스트 ⬜

> **기능 ID:** F002, F005, F006, F007, F012 | **상태:** ⬜ 미시작

**테스트 체크리스트**

- [ ] Playwright: 전체 플로우 — 주최자 팀 생성 → 초대 링크 공유 → 멤버 합류 → 이벤트 생성 → 이벤트 공유 → 멤버 참여 신청 → 대기 등록 → 주최자 확정 처리
- [ ] Playwright: 대기자 자동 승격 플로우 — 확정자 취소 → 대기 1번 자동 승격 확인
- [ ] Playwright: 역할 접근 제어 — organizer 전용 페이지에 member 접근 차단 확인
- [ ] Playwright: 비로그인 → 공개 이벤트 조회 → 로그인 → 참여 신청 전체 플로우

---

### Phase 4: DB 구축 + API 연동 — 정산

**완료 기준:** 정산 생성 → 개인 금액 표시 → 납부 완료 처리 동작

---

#### TASK-028: DB 스키마 생성 및 RLS 정책 설정 (settlements, settlement_items) ⬜

> **기능 ID:** F008, F009 (데이터 계층) | **상태:** ⬜ 미시작

- Supabase 마이그레이션 파일 작성 및 적용
  - `settlements` 테이블 생성 (`id`, `event_id`, `total_amount`, `memo`, `status`, `created_by`, `created_at`, `updated_at`)
  - `settlement_items` 테이블 생성 (`id`, `settlement_id`, `user_id`, `amount`, `paid_status`, `paid_at`, `created_at`, `updated_at`)
- RLS 정책 설정
  - `settlements`: 팀 멤버만 조회, organizer만 생성/수정
  - `settlement_items`: 팀 멤버 조회, organizer는 `paid_status` 수정 가능, 본인 레코드 조회
- Supabase 타입 재생성

**관련 파일/경로**

```
supabase/migrations/YYYYMMDD_phase4_settlements.sql
types/supabase.ts
```

**테스트 체크리스트**

- [ ] Supabase 대시보드에서 `settlements`, `settlement_items` 테이블 생성 확인
- [ ] RLS: member 계정으로 정산 생성 시도 → 차단 확인
- [ ] RLS: member 계정으로 다른 사람의 `paid_status` 수정 시도 → 차단 확인

---

#### TASK-029: 정산 생성 페이지 API 연동 ⬜

> **기능 ID:** F008 | **상태:** ⬜ 미시작

- `app/actions/settlements.ts` 서버 액션 구현
  - `createSettlement(eventId, formData)` — 정산 생성 로직
    - 확정 참여자 수 조회
    - `amount = Math.floor(total_amount / confirmedCount)`
    - 나머지 금액(`total_amount % confirmedCount`)은 주최자 `amount`에 합산
    - `settlement_items` 레코드 일괄 생성
- 정산 생성 페이지 더미 데이터 → 실제 확정 참여자 수 기반 계산 교체
- 생성 성공 후 정산 현황 페이지로 이동

**관련 파일/경로**

```
app/actions/settlements.ts
app/(dashboard)/teams/[teamId]/events/[eventId]/settlement/new/page.tsx
```

**테스트 체크리스트**

- [ ] Playwright: 총비용 입력 → 1/N 미리보기 실시간 업데이트 확인
- [ ] Playwright: 정산 생성 → 정산 현황 페이지로 이동 + 개인 금액 표시 확인
- [ ] Playwright: 나머지 금액이 주최자에게 합산되는지 DB 값 확인
- [ ] Playwright: 확정 참여자가 없는 이벤트에서 정산 생성 시도 → 에러 표시 확인
- [ ] Playwright: member 계정으로 정산 생성 페이지 접근 → 리디렉션 확인

---

#### TASK-030: 정산 현황 페이지 API 연동 ⬜

> **기능 ID:** F009 | **상태:** ⬜ 미시작

- `app/actions/settlements.ts` 추가 액션 구현
  - `getSettlementByEvent(eventId)` — 정산 및 항목 조회
  - `markAsPaid(settlementItemId)` — 납부 확인 처리 (organizer 전용, `paid_at` 기록)
  - `completeSettlement(settlementId)` — 전원 납부 완료 시 정산 `completed` 처리
- 정산 현황 페이지 더미 데이터 → 실제 데이터 교체
- organizer 전용 "납부 확인" 토글 버튼 실제 액션 연동

**관련 파일/경로**

```
app/actions/settlements.ts
app/(dashboard)/teams/[teamId]/events/[eventId]/settlement/page.tsx
```

**테스트 체크리스트**

- [ ] Playwright: 정산 현황 페이지에서 개인별 납부 금액 정확히 표시 확인
- [ ] Playwright: organizer가 납부 확인 토글 → `paid_status` 변경 + `paid_at` 기록 확인
- [ ] Playwright: 전원 납부 완료 후 "정산 완료" 버튼 활성화 → 클릭 시 `settlements.status = completed` 확인
- [ ] Playwright: 정산 미생성 상태에서 organizer에게 "정산 만들기" 버튼 표시 확인
- [ ] Playwright: member 계정으로 납부 확인 버튼 조작 시도 → 차단 확인

---

#### TASK-031: 전체 서비스 E2E 통합 테스트 ⬜

> **기능 ID:** F001~F012 전체 | **상태:** ⬜ 미시작

**테스트 체크리스트**

- [ ] Playwright: 전체 정산 플로우 — 이벤트 종료 → 정산 생성 → 개인 금액 확인 → 납부 확인 처리 → 정산 완료
- [ ] Playwright: 나머지 금액 합산 — 홀수 금액 분배 시 주최자에게 나머지 합산 정확성 확인
- [ ] Playwright: 정산 완료 후 재생성 시도 → 적절한 안내 메시지 표시 확인
- [ ] Playwright: 전체 서비스 E2E — 팀 생성 → 이벤트 생성 → 참여 신청 → 참여자 관리 → 정산 생성 → 납부 완료 전체 플로우

---

## 전체 진행률 요약

| Phase    | 설명                             | 전체 Task 수 |  완료  | 진행률  |
| -------- | -------------------------------- | :----------: | :----: | :-----: |
| Phase 0  | 기반 환경 구축                   |      1       |   1    | 100% ✅ |
| Phase 1  | 전체 UI/UX 구현 (더미 데이터)    |      16      |   16   | 100% ✅ |
| Phase 2  | DB + API 연동 — 팀 + 이벤트      |      3       |   3    | 100% ✅ |
| Phase 3  | DB + API 연동 — 참여 + 멤버 관리 |      7       |   0    |  0% ⬜  |
| Phase 4  | DB + API 연동 — 정산             |      4       |   0    |  0% ⬜  |
| **합계** |                                  |    **31**    | **20** | **65%** |

---

## 기능 ID별 구현 현황

| 기능 ID | 기능명                 | UI Task            | API Task                     | 상태 |
| ------- | ---------------------- | ------------------ | ---------------------------- | ---- |
| F001    | 팀 생성                | TASK-005           | TASK-019                     | ✅   |
| F002    | 팀 초대 링크           | TASK-011, TASK-012 | TASK-024, TASK-025           | ⬜   |
| F003    | 이벤트 생성/수정       | TASK-007           | TASK-020                     | ✅   |
| F004    | 이벤트 공개 공유       | TASK-009           | TASK-020                     | ✅   |
| F005    | 참여 신청/취소         | TASK-008, TASK-009 | TASK-022                     | ⬜   |
| F006    | 대기자 자동 승격       | TASK-010           | TASK-021, TASK-022, TASK-023 | ⬜   |
| F007    | 참여자 관리 (주최자)   | TASK-010           | TASK-023                     | ⬜   |
| F008    | 정산 생성              | TASK-014           | TASK-029                     | ⬜   |
| F009    | 정산 현황 및 납부 확인 | TASK-015           | TASK-030                     | ⬜   |
| F010    | 대시보드               | TASK-004           | TASK-019                     | ✅   |
| F011    | 기본 인증              | TASK-001           | TASK-001                     | ✅   |
| F012    | 팀 설정                | TASK-013           | TASK-026                     | ⬜   |
| F-ADMIN | 관리자 백오피스        | TASK-016, TASK-017 | -                            | ✅   |
