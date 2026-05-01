import { PageHeader } from "@/components/layout/page-header";
import { SettlementForm } from "@/components/settlements/settlement-form";
import { dummyEvents, dummyParticipants, dummyTeams } from "@/lib/dummy-data";
import { ParticipantStatus } from "@/types/domain";

interface SettlementNewPageProps {
  params: Promise<{ teamId: string; eventId: string }>;
}

export default async function SettlementNewPage({
  params,
}: SettlementNewPageProps) {
  const { teamId, eventId } = await params;
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];
  const event = dummyEvents.find((e) => e.id === eventId) ?? dummyEvents[0];

  // 확정 참여자 수 계산
  const confirmedCount = dummyParticipants.filter(
    (p) => p.eventId === event.id && p.status === ParticipantStatus.CONFIRMED,
  ).length;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="정산 생성"
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: team.name, href: `/teams/${team.id}` },
          { label: event.title, href: `/teams/${team.id}/events/${event.id}` },
          { label: "정산 생성" },
        ]}
      />
      <SettlementForm eventId={event.id} confirmedCount={confirmedCount} />
    </div>
  );
}
