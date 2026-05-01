import { BarChart3, CalendarDays, Users, Wallet } from "lucide-react";

import { StatsCard } from "@/components/admin/stats-card";
import { PageHeader } from "@/components/layout/page-header";
import {
  dummyAdminUsers,
  dummyAdminTeams,
  dummyAdminEvents,
  dummyAdminSettlements,
} from "@/lib/dummy-data";

export default function AdminPage() {
  const pendingSettlements = dummyAdminSettlements.filter(
    (s) => s.status === "pending",
  ).length;

  const recentUsers = [...dummyAdminUsers]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const recentTeams = [...dummyAdminTeams]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="개요" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="총 유저 수"
          value={dummyAdminUsers.length}
          icon={Users}
        />
        <StatsCard
          label="총 팀 수"
          value={dummyAdminTeams.length}
          icon={BarChart3}
        />
        <StatsCard
          label="총 이벤트 수"
          value={dummyAdminEvents.length}
          icon={CalendarDays}
        />
        <StatsCard
          label="미완료 정산"
          value={pendingSettlements}
          icon={Wallet}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            최근 가입 유저
          </h2>
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium">이름</th>
                  <th className="px-4 py-2.5 text-left font-medium">이메일</th>
                  <th className="px-4 py-2.5 text-right font-medium">가입일</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="px-4 py-2.5 font-medium">{user.fullName}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            최근 생성 팀
          </h2>
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium">팀명</th>
                  <th className="px-4 py-2.5 text-right font-medium">멤버</th>
                  <th className="px-4 py-2.5 text-right font-medium">이벤트</th>
                </tr>
              </thead>
              <tbody>
                {recentTeams.map((team) => (
                  <tr key={team.id} className="border-b last:border-0">
                    <td className="px-4 py-2.5 font-medium">{team.name}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {team.memberCount}명
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {team.eventCount}개
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
