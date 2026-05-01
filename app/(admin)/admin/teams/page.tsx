import { TeamsTable } from "@/components/admin/teams-table";
import { PageHeader } from "@/components/layout/page-header";
import { dummyAdminTeams } from "@/lib/dummy-data";

export default function AdminTeamsPage() {
  return (
    <div>
      <PageHeader
        title="팀 목록"
        breadcrumbs={[{ label: "관리자", href: "/admin" }, { label: "팀" }]}
      />
      <TeamsTable teams={dummyAdminTeams} />
    </div>
  );
}
