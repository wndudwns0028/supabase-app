import { CalendarDays, MapPin, Users, Wallet } from "lucide-react";

import { EventStatusBadge } from "@/components/ui/status-badge";
import { Event } from "@/types/domain";

interface EventDetailHeaderProps {
  event: Event;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
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
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <h1 className="flex-1 text-2xl font-bold leading-snug">
          {event.title}
        </h1>
        <EventStatusBadge status={event.status} />
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>
            {formatDate(event.startsAt)} ~ {formatDate(event.endsAt)}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            {event.maxParticipants
              ? `최대 ${event.maxParticipants}명`
              : "인원 제한 없음"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 shrink-0" />
          <span>
            {event.entryFee > 0
              ? `참가비 ${event.entryFee.toLocaleString()}원`
              : "무료"}
          </span>
        </div>
      </div>

      {event.description && (
        <p className="rounded-lg bg-muted p-4 text-sm leading-relaxed">
          {event.description}
        </p>
      )}
    </div>
  );
}
