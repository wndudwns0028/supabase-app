import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { TeamSidebar } from "@/components/layout/team-sidebar";
import { TeamSettingsForm } from "@/components/teams/team-settings-form";
import { Button } from "@/components/ui/button";
import { dummyCurrentUser, dummyTeams } from "@/lib/dummy-data";

interface TeamSettingsPageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamSettingsPage({
  params,
}: TeamSettingsPageProps) {
  const { teamId } = await params;
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];
  const isOrganizer = dummyCurrentUser.role === "organizer";

  // 비주최자 접근 차단 안내
  if (!isOrganizer) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <p className="text-muted-foreground">
          팀 설정은 주최자만 접근할 수 있습니다.
        </p>
        <Button asChild variant="outline">
          <Link href={`/teams/${team.id}`}>팀 홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <TeamSidebar teamId={team.id} />
      <div className="min-w-0 flex-1">
        <PageHeader
          title="팀 설정"
          breadcrumbs={[
            { label: "대시보드", href: "/dashboard" },
            { label: team.name, href: `/teams/${team.id}` },
            { label: "팀 설정" },
          ]}
        />
        <div className="max-w-lg">
          <TeamSettingsForm
            teamId={team.id}
            defaultValues={{
              name: team.name,
              description: team.description ?? "",
              sportType: team.sportType,
            }}
          />
        </div>
      </div>
    </div>
  );
}
