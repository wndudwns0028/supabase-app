"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Check, Copy, Settings, Users } from "lucide-react";

import { EventDetailHeader } from "@/components/events/event-detail-header";
import { ParticipantActionButton } from "@/components/events/participant-action-button";
import { ParticipationStatus } from "@/components/events/participation-status";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  dummyCurrentUser,
  dummyEvents,
  dummyParticipants,
  dummyTeams,
} from "@/lib/dummy-data";
import { EventStatus, ParticipantStatus } from "@/types/domain";

export default function EventDetailPage() {
  const params = useParams<{ teamId: string; eventId: string }>();
  const { teamId, eventId } = params;

  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];
  const event = dummyEvents.find((e) => e.id === eventId) ?? dummyEvents[0];
  const participants = dummyParticipants.filter((p) => p.eventId === event.id);

  const isOrganizer = dummyCurrentUser.role === "organizer";

  // 현재 유저의 참여 상태
  const myParticipation = participants.find(
    (p) => p.userId === dummyCurrentUser.userId,
  );
  const myStatus = myParticipation?.status ?? null;

  // 정원 초과 여부
  const confirmedCount = participants.filter(
    (p) => p.status === ParticipantStatus.CONFIRMED,
  ).length;
  const isFull =
    event.maxParticipants !== null && confirmedCount >= event.maxParticipants;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/events/${event.id}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={event.title}
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: team.name, href: `/teams/${team.id}` },
          { label: event.title },
        ]}
      />

      <EventDetailHeader event={event} />

      <Separator />

      <ParticipationStatus
        participants={participants}
        maxParticipants={event.maxParticipants}
      />

      {/* 참여 신청/취소 (OPEN 상태일 때만) */}
      {event.status === EventStatus.OPEN && !isOrganizer && (
        <ParticipantActionButton
          eventId={event.id}
          myStatus={myStatus}
          isFull={isFull}
        />
      )}

      {/* 공유 링크 복사 */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="mr-1.5 h-4 w-4" /> 복사됨
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-4 w-4" /> 공유 링크 복사
            </>
          )}
        </Button>
      </div>

      {/* organizer 전용 관리 버튼 */}
      {isOrganizer && (
        <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-4">
          <p className="mb-1 w-full text-xs font-medium text-muted-foreground">
            주최자 관리
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/teams/${team.id}/events/${event.id}/edit`}>
              <Settings className="mr-1.5 h-4 w-4" />
              이벤트 수정
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/teams/${team.id}/events/${event.id}/participants`}>
              <Users className="mr-1.5 h-4 w-4" />
              참여자 관리
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/teams/${team.id}/events/${event.id}/settlement`}>
              정산 관리
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
