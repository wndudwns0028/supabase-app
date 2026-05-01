import { UsersTable } from "@/components/admin/users-table";
import { PageHeader } from "@/components/layout/page-header";
import { dummyAdminUsers } from "@/lib/dummy-data";

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader
        title="유저 목록"
        breadcrumbs={[{ label: "관리자", href: "/admin" }, { label: "유저" }]}
      />
      <UsersTable users={dummyAdminUsers} />
    </div>
  );
}
