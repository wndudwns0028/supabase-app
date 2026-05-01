import Link from "next/link";

import { CalendarDays, MapPin, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventStatusBadge } from "@/components/ui/status-badge";
import { Event } from "@/types/domain";

interface EventCardProps {
  event: Event;
  teamId: string;
  confirmedCount?: number;
}

export function EventCard({
  event,
  teamId,
  confirmedCount = 0,
}: EventCardProps) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Link href={`/teams/${teamId}/events/${event.id}`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">
              {event.title}
            </CardTitle>
            <EventStatusBadge status={event.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatDate(event.startsAt)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              {confirmedCount}
              {event.maxParticipants ? ` / ${event.maxParticipants}명` : "명"}
            </span>
          </div>
          {event.entryFee > 0 && (
            <div className="font-medium text-foreground">
              참가비 {event.entryFee.toLocaleString()}원
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
