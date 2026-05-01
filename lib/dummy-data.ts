import {
  Event,
  EventParticipant,
  EventStatus,
  PaidStatus,
  ParticipantStatus,
  Settlement,
  SettlementItem,
  SportType,
  Team,
  TeamMember,
} from "@/types/domain";

// 현재 로그인 유저 (주최자 역할) — Phase 1 UI 테스트 기본값
export const dummyCurrentUser: TeamMember = {
  id: "member-1",
  teamId: "team-1",
  userId: "user-1",
  role: "organizer",
  joinedAt: "2025-01-01T00:00:00Z",
};

// 일반 멤버 유저 — 역할 분기(organizer/member) UI 테스트용
export const dummyMemberUser: TeamMember = {
  id: "member-2",
  teamId: "team-1",
  userId: "user-2",
  role: "member",
  joinedAt: "2025-01-05T00:00:00Z",
};

// 팀 목록 더미 데이터
export const dummyTeams: Team[] = [
  {
    id: "team-1",
    name: "수영 동호회 A",
    description: "매주 토요일 아침 수영 모임입니다.",
    sportType: SportType.SWIMMING,
    inviteToken: "invite-token-abc123",
    createdBy: "user-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "team-2",
    name: "탁구 동호회 B",
    description: "주중 저녁 탁구 동호회입니다.",
    sportType: SportType.TABLETENNIS,
    inviteToken: "invite-token-def456",
    createdBy: "user-1",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
];

// 이벤트 목록 더미 데이터 (OPEN/CLOSED/CANCELLED 각 1개)
export const dummyEvents: Event[] = [
  {
    id: "event-1",
    teamId: "team-1",
    createdBy: "user-1",
    title: "3월 정기 수영 모임",
    description: "이번 달 정기 수영 모임입니다. 많은 참여 부탁드립니다.",
    location: "XX 수영장 3레인",
    startsAt: new Date("2025-03-15T09:00:00Z"),
    endsAt: new Date("2025-03-15T11:00:00Z"),
    maxParticipants: 10,
    entryFee: 5000,
    status: EventStatus.OPEN,
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "event-2",
    teamId: "team-1",
    createdBy: "user-1",
    title: "2월 수영 모임",
    description: "2월 정기 모임 — 마감 완료",
    location: "XX 수영장 2레인",
    startsAt: new Date("2025-02-15T09:00:00Z"),
    endsAt: new Date("2025-02-15T11:00:00Z"),
    maxParticipants: 8,
    entryFee: 5000,
    status: EventStatus.CLOSED,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-16T00:00:00Z",
  },
  {
    id: "event-3",
    teamId: "team-1",
    createdBy: "user-1",
    title: "1월 번개 모임",
    description: "갑작스러운 일정으로 취소된 모임입니다.",
    location: "YY 수영장",
    startsAt: new Date("2025-01-20T09:00:00Z"),
    endsAt: new Date("2025-01-20T11:00:00Z"),
    maxParticipants: null,
    entryFee: 0,
    status: EventStatus.CANCELLED,
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-18T00:00:00Z",
  },
];

// 참여자 목록 더미 데이터 (event-1 기준)
export const dummyParticipants: EventParticipant[] = [
  {
    id: "participant-1",
    eventId: "event-1",
    userId: "user-1",
    status: ParticipantStatus.CONFIRMED,
    createdAt: "2025-03-02T00:00:00Z",
    updatedAt: "2025-03-02T00:00:00Z",
  },
  {
    id: "participant-2",
    eventId: "event-1",
    userId: "user-2",
    status: ParticipantStatus.CONFIRMED,
    createdAt: "2025-03-03T00:00:00Z",
    updatedAt: "2025-03-03T00:00:00Z",
  },
  {
    id: "participant-3",
    eventId: "event-1",
    userId: "user-3",
    status: ParticipantStatus.CONFIRMED,
    note: "늦게 도착할 수 있습니다.",
    createdAt: "2025-03-04T00:00:00Z",
    updatedAt: "2025-03-04T00:00:00Z",
  },
  {
    id: "participant-4",
    eventId: "event-1",
    userId: "user-4",
    status: ParticipantStatus.WAITLISTED,
    createdAt: "2025-03-05T00:00:00Z",
    updatedAt: "2025-03-05T00:00:00Z",
  },
  {
    id: "participant-5",
    eventId: "event-1",
    userId: "user-5",
    status: ParticipantStatus.CANCELLED,
    createdAt: "2025-03-06T00:00:00Z",
    updatedAt: "2025-03-07T00:00:00Z",
  },
];

// 정산 더미 데이터 (event-1 기준)
export const dummySettlement: Settlement = {
  id: "settlement-1",
  eventId: "event-1",
  totalAmount: 15000,
  memo: "수영장 이용료 + 강사비 포함",
  status: "pending",
  createdBy: "user-1",
  createdAt: "2025-03-16T00:00:00Z",
  updatedAt: "2025-03-16T00:00:00Z",
};

// 정산 항목 더미 데이터 (1/3 납부 완료, 2/3 미납)
export const dummySettlementItems: SettlementItem[] = [
  {
    id: "item-1",
    settlementId: "settlement-1",
    userId: "user-1",
    amount: 5000,
    paidStatus: PaidStatus.PAID,
    paidAt: "2025-03-17T00:00:00Z",
    createdAt: "2025-03-16T00:00:00Z",
    updatedAt: "2025-03-17T00:00:00Z",
  },
  {
    id: "item-2",
    settlementId: "settlement-1",
    userId: "user-2",
    amount: 5000,
    paidStatus: PaidStatus.UNPAID,
    createdAt: "2025-03-16T00:00:00Z",
    updatedAt: "2025-03-16T00:00:00Z",
  },
  {
    id: "item-3",
    settlementId: "settlement-1",
    userId: "user-3",
    amount: 5000,
    paidStatus: PaidStatus.UNPAID,
    createdAt: "2025-03-16T00:00:00Z",
    updatedAt: "2025-03-16T00:00:00Z",
  },
];

// ─── 어드민 전용 더미 데이터 ───────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  teamCount: number;
  createdAt: string;
}

export type AdminTeam = Team & { memberCount: number; eventCount: number };

export type AdminEvent = Event & { teamName: string; confirmedCount: number };

export type AdminSettlement = Settlement & {
  eventTitle: string;
  teamName: string;
  paidCount: number;
  totalCount: number;
};

export const dummyAdminUsers: AdminUser[] = [
  {
    id: "user-1",
    email: "alice@example.com",
    fullName: "김앨리스",
    teamCount: 2,
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    email: "bob@example.com",
    fullName: "이밥",
    teamCount: 1,
    createdAt: "2025-01-05T00:00:00Z",
  },
  {
    id: "user-3",
    email: "carol@example.com",
    fullName: "박캐롤",
    teamCount: 1,
    createdAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "user-4",
    email: "dave@example.com",
    fullName: "최데이브",
    teamCount: 1,
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "user-5",
    email: "eve@example.com",
    fullName: "정이브",
    teamCount: 0,
    createdAt: "2025-03-01T00:00:00Z",
  },
];

export const dummyAdminTeams: AdminTeam[] = [
  { ...dummyTeams[0], memberCount: 5, eventCount: 3 },
  { ...dummyTeams[1], memberCount: 3, eventCount: 1 },
];

export const dummyAdminEvents: AdminEvent[] = [
  { ...dummyEvents[0], teamName: "수영 동호회 A", confirmedCount: 3 },
  { ...dummyEvents[1], teamName: "수영 동호회 A", confirmedCount: 8 },
  { ...dummyEvents[2], teamName: "수영 동호회 A", confirmedCount: 0 },
];

export const dummyAdminSettlements: AdminSettlement[] = [
  {
    ...dummySettlement,
    eventTitle: "3월 정기 수영 모임",
    teamName: "수영 동호회 A",
    paidCount: 1,
    totalCount: 3,
  },
];
