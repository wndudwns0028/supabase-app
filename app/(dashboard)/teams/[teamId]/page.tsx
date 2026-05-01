import Link from "next/link";

import { Plus } from "lucide-react";

import { EventListTabs } from "@/components/events/event-list-tabs";
import { PageHeader } from "@/components/layout/page-header";
import { TeamSidebar } from "@/components/layout/team-sidebar";
import { Button } from "@/components/ui/button";
import {
  dummyCurrentUser,
  dummyEvents,
  dummyParticipants,
  dummyTeams,
} from "@/lib/dummy-data";
import { ParticipantStatus } from "@/types/domain";

interface TeamHomePageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamHomePage({ params }: TeamHomePageProps) {
  const { teamId } = await params;

  // 더미 데이터에서 팀 조회 (없으면 첫 번째 팀 사용)
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];

  // 해당 팀의 이벤트만 필터링
  const teamEvents = dummyEvents.filter((e) => e.teamId === team.id);

  // 이벤트별 확정 참여자 수 맵
  const confirmedCountMap = teamEvents.reduce<Record<string, number>>(
    (acc, event) => {
      acc[event.id] = dummyParticipants.filter(
        (p) =>
          p.eventId === event.id && p.status === ParticipantStatus.CONFIRMED,
      ).length;
      return acc;
    },
    {},
  );

  const isOrganizer = dummyCurrentUser.role === "organizer";

  return (
    <div className="flex gap-8">
      <TeamSidebar teamId={team.id} />
      <div className="min-w-0 flex-1">
        <PageHeader
          title={team.name}
          breadcrumbs={[
            { label: "대시보드", href: "/dashboard" },
            { label: team.name },
          ]}
          actions={
            isOrganizer ? (
              <Button asChild size="sm">
                <Link href={`/teams/${team.id}/events/new`}>
                  <Plus className="mr-1 h-4 w-4" />
                  이벤트 만들기
                </Link>
              </Button>
            ) : undefined
          }
        />
        <EventListTabs
          events={teamEvents}
          teamId={team.id}
          confirmedCountMap={confirmedCountMap}
        />
      </div>
    </div>
  );
}
