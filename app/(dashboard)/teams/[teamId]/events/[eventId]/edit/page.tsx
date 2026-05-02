import { notFound } from "next/navigation";

import { getEventById } from "@/app/actions/events";
import { getTeamById } from "@/app/actions/teams";
import { EventForm, eventToFormValues } from "@/components/events/event-form";
import { PageHeader } from "@/components/layout/page-header";
import { Event } from "@/types/domain";

interface EventEditPageProps {
  params: Promise<{ teamId: string; eventId: string }>;
}

export default async function EventEditPage({ params }: EventEditPageProps) {
  const { teamId, eventId } = await params;

  // 팀 정보 조회
  const teamResult = await getTeamById(teamId);
  if ("error" in teamResult) {
    notFound();
  }
  const { team } = teamResult;

  // 이벤트 정보 조회
  const eventResult = await getEventById(eventId);
  if ("error" in eventResult) {
    notFound();
  }
  const { event: eventWithDetails } = eventResult;

  // EventWithDetails → Event 변환 (eventToFormValues가 Event를 요구)
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

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="이벤트 수정"
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: team.name, href: `/teams/${team.id}` },
          {
            label: event.title,
            href: `/teams/${team.id}/events/${event.id}`,
          },
          { label: "수정" },
        ]}
      />
      <EventForm
        teamId={team.id}
        eventId={event.id}
        defaultValues={eventToFormValues(event)}
      />
    </div>
  );
}
