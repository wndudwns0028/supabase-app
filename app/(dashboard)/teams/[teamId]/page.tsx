import Link from "next/link";
import { notFound } from "next/navigation";

import { Plus } from "lucide-react";

import { getEventsByTeam } from "@/app/actions/events";
import { getTeamById } from "@/app/actions/teams";
import { EventListTabs } from "@/components/events/event-list-tabs";
import { PageHeader } from "@/components/layout/page-header";
import { TeamSidebar } from "@/components/layout/team-sidebar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Event } from "@/types/domain";

interface TeamHomePageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamHomePage({ params }: TeamHomePageProps) {
  const { teamId } = await params;

  // 현재 로그인 유저 확인
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ?? null;

  // 팀 정보 + 멤버 목록 조회
  const teamResult = await getTeamById(teamId);
  if ("error" in teamResult) {
    notFound();
  }
  const { team } = teamResult;

  // 팀 이벤트 목록 조회
  const eventsResult = await getEventsByTeam(teamId);
  const eventsWithCount = "events" in eventsResult ? eventsResult.events : [];

  // EventWithCount → Event 변환 (EventListTabs가 Event[] 요구)
  const teamEvents: Event[] = eventsWithCount.map((e) => ({
    id: e.id,
    teamId: e.teamId,
    createdBy: e.createdBy,
    title: e.title,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    startsAt: e.startsAt,
    endsAt: e.endsAt,
    maxParticipants: e.maxParticipants,
    entryFee: e.entryFee,
    status: e.status,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }));

  // 이벤트별 확정 참여자 수 맵
  const confirmedCountMap = eventsWithCount.reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.id] = e.confirmedCount;
      return acc;
    },
    {},
  );

  // 내 역할 확인 (organizer 여부)
  const myMembership = team.members.find((m) => m.userId === userId);
  const isOrganizer = myMembership?.role === "organizer";

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
