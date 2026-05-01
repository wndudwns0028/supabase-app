"use client";

import { UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ParticipantStatusBadge } from "@/components/ui/status-badge";
import { EventParticipant, ParticipantStatus } from "@/types/domain";

interface ParticipantActionRowProps {
  participant: EventParticipant;
  isCapacityFull: boolean;
  onConfirm: (id: string) => void;
  onForceCancel: (id: string) => void;
}

export function ParticipantActionRow({
  participant,
  isCapacityFull,
  onConfirm,
  onForceCancel,
}: ParticipantActionRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <UserCircle className="h-8 w-8 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{participant.userId}</span>
          <ParticipantStatusBadge status={participant.status} />
        </div>
        {participant.note && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {participant.note}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        {/* 대기자인 경우 확정 버튼 표시 */}
        {participant.status === ParticipantStatus.WAITLISTED && (
          <Button
            size="sm"
            variant="outline"
            disabled={isCapacityFull}
            onClick={() => onConfirm(participant.id)}
          >
            확정
          </Button>
        )}
        {/* 취소 상태가 아닌 경우 강제 취소 버튼 표시 */}
        {participant.status !== ParticipantStatus.CANCELLED && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onForceCancel(participant.id)}
          >
            취소
          </Button>
        )}
      </div>
    </div>
  );
}
