import { PageHeader } from "@/components/layout/page-header";
import { TeamForm } from "@/components/teams/team-form";

export default function TeamNewPage() {
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="팀 만들기"
        breadcrumbs={[
          { label: "대시보드", href: "/dashboard" },
          { label: "팀 만들기" },
        ]}
      />
      <TeamForm />
    </div>
  );
}
