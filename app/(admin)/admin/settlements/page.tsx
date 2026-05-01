import { SettlementsTable } from "@/components/admin/settlements-table";
import { PageHeader } from "@/components/layout/page-header";
import { dummyAdminSettlements } from "@/lib/dummy-data";

export default function AdminSettlementsPage() {
  return (
    <div>
      <PageHeader
        title="정산 목록"
        breadcrumbs={[{ label: "관리자", href: "/admin" }, { label: "정산" }]}
      />
      <SettlementsTable settlements={dummyAdminSettlements} />
    </div>
  );
}
