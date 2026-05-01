import { Badge } from "@/components/ui/badge";
import { EventStatus, PaidStatus, ParticipantStatus } from "@/types/domain";

// 이벤트 상태별 배지 색상 및 레이블 매핑
const eventStatusConfig: Record<
  EventStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [EventStatus.DRAFT]: { label: "초안", variant: "outline" },
  [EventStatus.OPEN]: { label: "모집중", variant: "default" },
  [EventStatus.CLOSED]: { label: "마감", variant: "secondary" },
  [EventStatus.CANCELLED]: { label: "취소", variant: "destructive" },
};

// 참여자 상태별 배지 색상 및 레이블 매핑
const participantStatusConfig: Record<
  ParticipantStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [ParticipantStatus.CONFIRMED]: { label: "확정", variant: "default" },
  [ParticipantStatus.WAITLISTED]: { label: "대기", variant: "outline" },
  [ParticipantStatus.CANCELLED]: { label: "취소", variant: "destructive" },
};

// 납부 상태별 배지 색상 및 레이블 매핑
const paidStatusConfig: Record<
  PaidStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [PaidStatus.PAID]: { label: "납부완료", variant: "default" },
  [PaidStatus.UNPAID]: { label: "미납", variant: "outline" },
};

interface EventStatusBadgeProps {
  status: EventStatus;
}

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const config = eventStatusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface ParticipantStatusBadgeProps {
  status: ParticipantStatus;
}

export function ParticipantStatusBadge({
  status,
}: ParticipantStatusBadgeProps) {
  const config = participantStatusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface PaidStatusBadgeProps {
  status: PaidStatus;
}

export function PaidStatusBadge({ status }: PaidStatusBadgeProps) {
  const config = paidStatusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
