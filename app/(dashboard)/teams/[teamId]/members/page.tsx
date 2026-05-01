import { PageHeader } from "@/components/layout/page-header";
import { TeamSidebar } from "@/components/layout/team-sidebar";
import { InviteLinkBox } from "@/components/teams/invite-link-box";
import { MemberList } from "@/components/teams/member-list";
import {
  dummyCurrentUser,
  dummyMemberUser,
  dummyTeams,
} from "@/lib/dummy-data";

interface TeamMembersPageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamMembersPage({
  params,
}: TeamMembersPageProps) {
  const { teamId } = await params;
  const team = dummyTeams.find((t) => t.id === teamId) ?? dummyTeams[0];

  // 더미 멤버 목록 (현재 유저 + 일반 멤버)
  const members = [dummyCurrentUser, dummyMemberUser];
  const isOrganizer = dummyCurrentUser.role === "organizer";

  return (
    <div className="flex gap-8">
      <TeamSidebar teamId={team.id} />
      <div className="min-w-0 flex-1 space-y-6">
        <PageHeader
          title="멤버 관리"
          breadcrumbs={[
            { label: "대시보드", href: "/dashboard" },
            { label: team.name, href: `/teams/${team.id}` },
            { label: "멤버 관리" },
          ]}
        />
        <InviteLinkBox
          teamId={team.id}
          inviteToken={team.inviteToken}
          isOrganizer={isOrganizer}
        />
        <MemberList members={members} />
      </div>
    </div>
  );
}
