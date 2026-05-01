import { CalendarDays, Users } from "lucide-react";

import { OnboardingEmpty } from "@/components/dashboard/onboarding-empty";
import { TeamCard } from "@/components/dashboard/team-card";
import { UpcomingEventItem } from "@/components/dashboard/upcoming-event-item";
import { PageHeader } from "@/components/layout/page-header";
import { dummyCurrentUser, dummyEvents, dummyTeams } from "@/lib/dummy-data";
import { EventStatus } from "@/types/domain";

export default function DashboardPage() {
  // OPEN 상태인 다가오는 이벤트만 필터링
  const upcomingEvents = dummyEvents.filter(
    (e) => e.status === EventStatus.OPEN,
  );

  const hasTeams = dummyTeams.length > 0;

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
              {dummyTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  myMembership={dummyCurrentUser}
                />
              ))}
            </div>
          </section>

          {/* 다가오는 이벤트 섹션 */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">다가오는 이벤트</h2>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                예정된 이벤트가 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingEvents.map((event) => {
                  const team = dummyTeams.find((t) => t.id === event.teamId)!;
                  return (
                    <UpcomingEventItem
                      key={event.id}
                      event={event}
                      team={team}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
