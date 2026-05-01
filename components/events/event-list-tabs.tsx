"use client";

import { CalendarDays } from "lucide-react";

import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event, EventStatus } from "@/types/domain";

interface EventListTabsProps {
  events: Event[];
  teamId: string;
  confirmedCountMap?: Record<string, number>;
}

export function EventListTabs({
  events,
  teamId,
  confirmedCountMap = {},
}: EventListTabsProps) {
  const openEvents = events.filter((e) => e.status === EventStatus.OPEN);
  const closedEvents = events.filter((e) => e.status === EventStatus.CLOSED);
  const cancelledEvents = events.filter(
    (e) => e.status === EventStatus.CANCELLED,
  );

  const renderList = (list: Event[], emptyMessage: string) => {
    if (list.length === 0) {
      return (
        <EmptyState
          icon={CalendarDays}
          title={emptyMessage}
          description="아직 해당 상태의 이벤트가 없습니다."
        />
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            teamId={teamId}
            confirmedCount={confirmedCountMap[event.id] ?? 0}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="open">
      <TabsList className="mb-4">
        <TabsTrigger value="open">
          예정 <span className="ml-1 text-xs">({openEvents.length})</span>
        </TabsTrigger>
        <TabsTrigger value="closed">
          완료 <span className="ml-1 text-xs">({closedEvents.length})</span>
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          취소 <span className="ml-1 text-xs">({cancelledEvents.length})</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open">
        {renderList(openEvents, "예정된 이벤트 없음")}
      </TabsContent>
      <TabsContent value="closed">
        {renderList(closedEvents, "완료된 이벤트 없음")}
      </TabsContent>
      <TabsContent value="cancelled">
        {renderList(cancelledEvents, "취소된 이벤트 없음")}
      </TabsContent>
    </Tabs>
  );
}
