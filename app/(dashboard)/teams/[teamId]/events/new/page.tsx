import { notFound } from "next/navigation";

import { getTeamById } from "@/app/actions/teams";
import { EventForm } from "@/components/events/event-form";
import { PageHeader } from "@/components/layout/page-header";

interface EventNewPageProps {
  params: Promise<{ teamId: string }>;
}

export default async function EventNewPage({ params }: EventNewPageProps) {
  const { teamId } = await params;

  // 팀 정보 조회 — 존재하지 않거나 접근 불가 시 404
  const teamResult = await getTeamById(teamId);
  if ("error" in teamResult) {
    notFound();
  }
  const { team } = teamResult;

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
