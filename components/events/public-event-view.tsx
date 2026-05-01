import Link from "next/link";

import { CalendarDays, MapPin, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EventStatusBadge } from "@/components/ui/status-badge";
import { Event } from "@/types/domain";

interface PublicEventViewProps {
  event: Event;
  // Phase 1에서는 더미 로그인 상태로 분기 테스트
  isLoggedIn: boolean;
}

export function PublicEventView({ event, isLoggedIn }: PublicEventViewProps) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      {/* 이벤트 헤더 */}
      <div className="space-y-2">
        <EventStatusBadge status={event.status} />
        <h1 className="text-3xl font-bold">{event.title}</h1>
      </div>

      {/* 이벤트 정보 */}
      <div className="space-y-3 rounded-lg border p-5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>
            {formatDate(event.startsAt)} ~ {formatDate(event.endsAt)}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            {event.maxParticipants
              ? `최대 ${event.maxParticipants}명`
              : "인원 제한 없음"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-4 w-4 shrink-0" />
          <span>
            {event.entryFee > 0
              ? `참가비 ${event.entryFee.toLocaleString()}원`
              : "무료"}
          </span>
        </div>
      </div>

      {event.description && (
        <p className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">
          {event.description}
        </p>
      )}

      <Separator />

      {/* 참여 신청 영역 */}
      <div className="space-y-3">
        {isLoggedIn ? (
          <Button className="w-full" size="lg">
            참여 신청
          </Button>
        ) : (
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              참여 신청하려면 로그인이 필요합니다.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/auth/login">로그인 후 참여 신청</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
