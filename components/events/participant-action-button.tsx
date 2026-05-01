"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ParticipantStatus } from "@/types/domain";

interface ParticipantActionButtonProps {
  eventId: string;
  // 현재 유저의 참여 상태 (null이면 미신청)
  myStatus: ParticipantStatus | null;
  isFull: boolean;
}

export function ParticipantActionButton({
  eventId: _eventId,
  myStatus,
  isFull,
}: ParticipantActionButtonProps) {
  const [status, setStatus] = useState<ParticipantStatus | null>(myStatus);

  const handleApply = () => {
    // Phase 2에서 실제 API 연동
    setStatus(
      isFull ? ParticipantStatus.WAITLISTED : ParticipantStatus.CONFIRMED,
    );
  };

  const handleCancel = () => {
    setStatus(null);
  };

  if (status === ParticipantStatus.CONFIRMED) {
    return (
      <Button variant="outline" onClick={handleCancel}>
        참여 취소
      </Button>
    );
  }

  if (status === ParticipantStatus.WAITLISTED) {
    return (
      <div className="space-y-1 text-center">
        <Button variant="outline" onClick={handleCancel}>
          대기 취소
        </Button>
        <p className="text-xs text-muted-foreground">현재 대기 중입니다.</p>
      </div>
    );
  }

  if (isFull) {
    return (
      <Button variant="secondary" onClick={handleApply}>
        대기 등록
      </Button>
    );
  }

  return <Button onClick={handleApply}>참여 신청</Button>;
}
