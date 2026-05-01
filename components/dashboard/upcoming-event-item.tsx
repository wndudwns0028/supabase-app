import Link from "next/link";

import { CalendarDays, MapPin } from "lucide-react";

import { EventStatusBadge } from "@/components/ui/status-badge";
import { Event, Team } from "@/types/domain";

interface UpcomingEventItemProps {
  event: Event;
  team: Team;
}

export function UpcomingEventItem({ event, team }: UpcomingEventItemProps) {
  // 날짜 포맷: YYYY년 MM월 DD일 HH:MM
  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Link href={`/teams/${team.id}/events/${event.id}`}>
      <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{team.name}</span>
            <EventStatusBadge status={event.status} />
          </div>
          <p className="truncate font-medium">{event.title}</p>
          <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(event.startsAt)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </span>
            )}
          </div>
        </div>
        {event.entryFee > 0 && (
          <div className="shrink-0 text-right">
            <span className="text-sm font-semibold">
              {event.entryFee.toLocaleString()}원
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
