import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ParticipantListTabs } from "@/components/participants/participant-list-tabs";
import { Button } from "@/components/ui/button";
import {
  dummyCurrentUser,
  dummyEvents,
  dummyParticipants,
  dummyTeams,
} from "@/lib/dummy-data";

interface ParticipantsPageProps {
  params: Promise<{ teamId: string; eventId: string }>;
}

export default async function ParticipantsPage({
  params,
}: ParticipantsPageProps) {
  const { teamId, eventId } = await params;
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];
  const event = dummyEvents.find((e) => e.id === eventId) ?? dummyEvents[0];
  const participants = dummyParticipants.filter((p) => p.eventId === event.id);

  const isOrganizer = dummyCurrentUser.role === "organizer";

  // 비주최자 접근 차단 안내
  if (!isOrganizer) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-muted-foreground">
          참여자 관리는 주최자만 접근할 수 있습니다.
        </p>
        <Button asChild variant="outline">
          <Link href={`/teams/${team.id}/events/${event.id}`}>
            이벤트 상세로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="참여자 관리"
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: team.name, href: `/teams/${team.id}` },
          {
            label: event.title,
            href: `/teams/${team.id}/events/${event.id}`,
          },
          { label: "참여자 관리" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/teams/${team.id}/events/${event.id}`}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              이벤트 상세
            </Link>
          </Button>
        }
      />
      <ParticipantListTabs
        initialParticipants={participants}
        maxParticipants={event.maxParticipants}
      />
    </div>
  );
}
