// 스포츠 종목 열거형
export enum SportType {
  SWIMMING = "swimming",
  FITNESS = "fitness",
  TABLETENNIS = "tabletennis",
  OTHER = "other",
}

// 이벤트 상태 열거형
export enum EventStatus {
  DRAFT = "draft",
  OPEN = "open",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

// 참여자 상태 열거형
export enum ParticipantStatus {
  CONFIRMED = "confirmed",
  WAITLISTED = "waitlisted",
  CANCELLED = "cancelled",
}

// 정산 납부 상태 열거형
export enum PaidStatus {
  UNPAID = "unpaid",
  PAID = "paid",
}

// 팀 인터페이스
export interface Team {
  id: string;
  name: string;
  description?: string;
  sportType: SportType;
  inviteToken: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 팀 멤버 인터페이스
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: "organizer" | "member";
  joinedAt: string;
}

// 이벤트 인터페이스
export interface Event {
  id: string;
  teamId: string;
  createdBy: string;
  title: string;
  description?: string;
  location?: string;
  startsAt: Date;
  endsAt: Date;
  maxParticipants: number | null;
  entryFee: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

// 이벤트 참여자 인터페이스
export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  status: ParticipantStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// 정산 인터페이스
export interface Settlement {
  id: string;
  eventId: string;
  totalAmount: number;
  memo?: string;
  status: "pending" | "completed";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 정산 항목 인터페이스
export interface SettlementItem {
  id: string;
  settlementId: string;
  userId: string;
  amount: number;
  paidStatus: PaidStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
