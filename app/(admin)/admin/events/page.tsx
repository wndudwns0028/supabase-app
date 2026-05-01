import { EventsTable } from "@/components/admin/events-table";
import { PageHeader } from "@/components/layout/page-header";
import { dummyAdminEvents } from "@/lib/dummy-data";

export default function AdminEventsPage() {
  return (
    <div>
      <PageHeader
        title="이벤트 목록"
        breadcrumbs={[{ label: "관리자", href: "/admin" }, { label: "이벤트" }]}
      />
      <EventsTable events={dummyAdminEvents} />
    </div>
  );
}
