"use client";

import { useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { EventStatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type AdminEvent } from "@/lib/dummy-data";
import { EventStatus } from "@/types/domain";

const STATUS_TABS = [
  { value: "all", label: "전체" },
  { value: EventStatus.OPEN, label: "모집중" },
  { value: EventStatus.CLOSED, label: "마감" },
  { value: EventStatus.CANCELLED, label: "취소" },
  { value: EventStatus.DRAFT, label: "초안" },
];

interface EventsTableProps {
  events: AdminEvent[];
}

export function EventsTable({ events }: EventsTableProps) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered =
    statusFilter === "all"
      ? events
      : events.filter((e) => e.status === statusFilter);

  return (
    <div className="space-y-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2.5 text-left font-medium">이벤트명</th>
              <th className="px-4 py-2.5 text-left font-medium">팀명</th>
              <th className="px-4 py-2.5 text-left font-medium">시작일시</th>
              <th className="px-4 py-2.5 text-right font-medium">참여</th>
              <th className="px-4 py-2.5 text-center font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8">
                  <EmptyState
                    title="이벤트 없음"
                    description="해당 상태의 이벤트가 없습니다."
                  />
                </td>
              </tr>
            ) : (
              filtered.map((event) => (
                <tr
                  key={event.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {event.teamName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {event.startsAt.toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {event.confirmedCount}
                    {event.maxParticipants ? `/${event.maxParticipants}` : "명"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <EventStatusBadge status={event.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
