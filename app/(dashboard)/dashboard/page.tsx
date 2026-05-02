import { CalendarDays, Users } from "lucide-react";

import { getMyTeams } from "@/app/actions/teams";
import { OnboardingEmpty } from "@/components/dashboard/onboarding-empty";
import { TeamCard } from "@/components/dashboard/team-card";
import { PageHeader } from "@/components/layout/page-header";
import { Team, TeamMember } from "@/types/domain";

export default async function DashboardPage() {
  // 내 팀 목록 조회 — 에러 시 빈 배열로 폴백 (UX 저하 방지)
  const teamsResult = await getMyTeams();
  const teamRows = "teams" in teamsResult ? teamsResult.teams : [];

  const hasTeams = teamRows.length > 0;

  return (
    <div>
      <PageHeader title="대시보드" />

      {!hasTeams ? (
        <OnboardingEmpty />
      ) : (
        <div className="space-y-10">
          {/* 내 팀 목록 섹션 */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">내 팀</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamRows.map((teamWithRole) => {
                // TeamWithRole → Team + TeamMember 로 분리
                const team: Team = {
                  id: teamWithRole.id,
                  name: teamWithRole.name,
                  description: teamWithRole.description ?? undefined,
                  sportType: teamWithRole.sportType,
                  inviteToken: teamWithRole.inviteToken,
                  createdBy: teamWithRole.createdBy,
                  createdAt: teamWithRole.createdAt,
                  updatedAt: teamWithRole.updatedAt,
                };
                const myMembership: TeamMember = {
                  id: "",
                  teamId: teamWithRole.id,
                  userId: teamWithRole.createdBy,
                  role: teamWithRole.myRole,
                  joinedAt: teamWithRole.createdAt,
                };
                return (
                  <TeamCard
                    key={team.id}
                    team={team}
                    myMembership={myMembership}
                  />
                );
              })}
            </div>
          </section>

          {/* 다가오는 이벤트 섹션 — 각 팀 페이지에서 이벤트 확인 안내 */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">다가오는 이벤트</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              각 팀 페이지에서 이벤트를 확인하세요.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
