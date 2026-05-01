import { EventForm } from "@/components/events/event-form";
import { PageHeader } from "@/components/layout/page-header";
import { dummyTeams } from "@/lib/dummy-data";

interface EventNewPageProps {
  params: Promise<{ teamId: string }>;
}

export default async function EventNewPage({ params }: EventNewPageProps) {
  const { teamId } = await params;
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="이벤트 만들기"
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: team.name, href: `/teams/${team.id}` },
          { label: "이벤트 만들기" },
        ]}
      />
      <EventForm teamId={team.id} />
    </div>
  );
}
