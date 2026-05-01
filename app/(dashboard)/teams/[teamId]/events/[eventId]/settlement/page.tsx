import Link from "next/link";

import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { SettlementStatusView } from "@/components/settlements/settlement-status-view";
import { Button } from "@/components/ui/button";
import {
  dummyCurrentUser,
  dummyEvents,
  dummySettlement,
  dummySettlementItems,
  dummyTeams,
} from "@/lib/dummy-data";

interface SettlementPageProps {
  params: Promise<{ teamId: string; eventId: string }>;
}

export default async function SettlementPage({ params }: SettlementPageProps) {
  const { teamId, eventId } = await params;
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];
  const event = dummyEvents.find((e) => e.id === eventId) ?? dummyEvents[0];
  const isOrganizer = dummyCurrentUser.role === "organizer";

  // 더미 데이터에서 이벤트에 해당하는 정산 조회
  const settlement =
    dummySettlement.eventId === event.id ? dummySettlement : null;
  const items = settlement ? dummySettlementItems : [];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="정산 현황"
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: team.name, href: `/teams/${team.id}` },
          { label: event.title, href: `/teams/${team.id}/events/${event.id}` },
          { label: "정산" },
        ]}
        actions={
          !settlement && isOrganizer ? (
            <Button asChild size="sm">
              <Link
                href={`/teams/${team.id}/events/${event.id}/settlement/new`}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                정산 만들기
              </Link>
            </Button>
          ) : undefined
        }
      />

      {settlement ? (
        <SettlementStatusView
          settlement={settlement}
          items={items}
          isOrganizer={isOrganizer}
        />
      ) : (
        <div className="space-y-3 py-16 text-center">
          <p className="text-muted-foreground">
            아직 정산이 생성되지 않았습니다.
          </p>
          {isOrganizer && (
            <Button asChild>
              <Link
                href={`/teams/${team.id}/events/${event.id}/settlement/new`}
              >
                정산 만들기
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
