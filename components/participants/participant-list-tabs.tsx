"use client";

import { useState } from "react";

import { Users } from "lucide-react";

import { ParticipantActionRow } from "@/components/participants/participant-action-row";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventParticipant, ParticipantStatus } from "@/types/domain";

interface ParticipantListTabsProps {
  initialParticipants: EventParticipant[];
  maxParticipants: number | null;
}

export function ParticipantListTabs({
  initialParticipants,
  maxParticipants,
}: ParticipantListTabsProps) {
  const [participants, setParticipants] =
    useState<EventParticipant[]>(initialParticipants);

  const confirmed = participants.filter(
    (p) => p.status === ParticipantStatus.CONFIRMED,
  );
  const waitlisted = participants.filter(
    (p) => p.status === ParticipantStatus.WAITLISTED,
  );
  const cancelled = participants.filter(
    (p) => p.status === ParticipantStatus.CANCELLED,
  );

  // 정원 초과 여부
  const isCapacityFull =
    maxParticipants !== null && confirmed.length >= maxParticipants;

  const handleConfirm = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: ParticipantStatus.CONFIRMED } : p,
      ),
    );
  };

  const handleForceCancel = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: ParticipantStatus.CANCELLED } : p,
      ),
    );
  };

  const renderList = (list: EventParticipant[], emptyText: string) => {
    if (list.length === 0) {
      return <EmptyState icon={Users} title={emptyText} />;
    }
    return (
      <div className="space-y-2">
        {list.map((p) => (
          <ParticipantActionRow
            key={p.id}
            participant={p}
            isCapacityFull={isCapacityFull}
            onConfirm={handleConfirm}
            onForceCancel={handleForceCancel}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="confirmed">
      <TabsList className="mb-4">
        <TabsTrigger value="confirmed">
          확정 <span className="ml-1 text-xs">({confirmed.length})</span>
        </TabsTrigger>
        <TabsTrigger value="waitlisted">
          대기 <span className="ml-1 text-xs">({waitlisted.length})</span>
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          취소 <span className="ml-1 text-xs">({cancelled.length})</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="confirmed">
        {renderList(confirmed, "확정된 참여자가 없습니다.")}
      </TabsContent>
      <TabsContent value="waitlisted">
        {renderList(waitlisted, "대기 중인 참여자가 없습니다.")}
      </TabsContent>
      <TabsContent value="cancelled">
        {renderList(cancelled, "취소한 참여자가 없습니다.")}
      </TabsContent>
    </Tabs>
  );
}
