import { EventForm, eventToFormValues } from "@/components/events/event-form";
import { PageHeader } from "@/components/layout/page-header";
import { dummyEvents, dummyTeams } from "@/lib/dummy-data";

interface EventEditPageProps {
  params: Promise<{ teamId: string; eventId: string }>;
}

export default async function EventEditPage({ params }: EventEditPageProps) {
  const { teamId, eventId } = await params;
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];
  const event = dummyEvents.find((e) => e.id === eventId) ?? dummyEvents[0];

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="이벤트 수정"
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: team.name, href: `/teams/${team.id}` },
          { label: event.title, href: `/teams/${team.id}/events/${event.id}` },
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
