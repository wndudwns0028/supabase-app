import Link from "next/link";
import { notFound } from "next/navigation";

import { Settings, Users } from "lucide-react";

import { getEventById } from "@/app/actions/events";
import { getTeamById } from "@/app/actions/teams";
import { CopyLinkButton } from "@/components/events/copy-link-button";
import { EventDetailHeader } from "@/components/events/event-detail-header";
import { ParticipantActionButton } from "@/components/events/participant-action-button";
import { ParticipationStatus } from "@/components/events/participation-status";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { Event, EventStatus } from "@/types/domain";

interface EventDetailPageProps {
  params: Promise<{ teamId: string; eventId: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { teamId, eventId } = await params;

  // 현재 로그인 유저 확인
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ?? null;

  // 이벤트 정보 조회
  const eventResult = await getEventById(eventId);
  if ("error" in eventResult) {
    notFound();
  }
  const { event: eventWithDetails } = eventResult;

  // 팀 정보 조회 (breadcrumb용)
  const teamResult = await getTeamById(teamId);
  const teamName = "team" in teamResult ? teamResult.team.name : "팀";
  const myRole =
    "team" in teamResult
      ? (teamResult.team.members.find((m) => m.userId === userId)?.role ?? null)
      : null;

  // EventWithDetails → Event 변환 (컴포넌트가 Event 타입 요구)
  const event: Event = {
    id: eventWithDetails.id,
    teamId: eventWithDetails.teamId,
    createdBy: eventWithDetails.createdBy,
    title: eventWithDetails.title,
    description: eventWithDetails.description ?? undefined,
    location: eventWithDetails.location ?? undefined,
    startsAt: eventWithDetails.startsAt,
    endsAt: eventWithDetails.endsAt,
    maxParticipants: eventWithDetails.maxParticipants,
    entryFee: eventWithDetails.entryFee,
    status: eventWithDetails.status,
    createdAt: eventWithDetails.createdAt,
    updatedAt: eventWithDetails.updatedAt,
  };

  const isOrganizer = myRole === "organizer";

  // 참여자 현황 (Phase 3에서 실제 데이터로 교체)
  const participants = eventWithDetails.participants;
  const confirmedCount = participants.filter(
    (p) => p.status === "confirmed",
  ).length;
  const isFull =
    event.maxParticipants !== null && confirmedCount >= event.maxParticipants;

  // 현재 유저의 참여 상태 (Phase 3에서 실제 데이터로 교체)
  const myParticipation = participants.find((p) => p.userId === userId);
  const myStatus = myParticipation
    ? (myParticipation.status as import("@/types/domain").ParticipantStatus)
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={event.title}
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: teamName, href: `/teams/${teamId}` },
          { label: event.title },
        ]}
      />

      <EventDetailHeader event={event} />

      <Separator />

      <ParticipationStatus
        participants={[]}
        maxParticipants={event.maxParticipants}
      />

      {/* 참여 신청/취소 (OPEN 상태이고 주최자가 아닐 때만) */}
      {event.status === EventStatus.OPEN && !isOrganizer && (
        <ParticipantActionButton
          eventId={event.id}
          myStatus={myStatus}
          isFull={isFull}
        />
      )}

      {/* 공유 링크 복사 */}
      <div className="flex items-center gap-2">
        <CopyLinkButton eventId={event.id} />
      </div>

      {/* organizer 전용 관리 버튼 */}
      {isOrganizer && (
        <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-4">
          <p className="mb-1 w-full text-xs font-medium text-muted-foreground">
            주최자 관리
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/teams/${teamId}/events/${event.id}/edit`}>
              <Settings className="mr-1.5 h-4 w-4" />
              이벤트 수정
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/teams/${teamId}/events/${event.id}/participants`}>
              <Users className="mr-1.5 h-4 w-4" />
              참여자 관리
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/teams/${teamId}/events/${event.id}/settlement`}>
              정산 관리
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
