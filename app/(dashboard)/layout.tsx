import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 리디렉션은 proxy.ts가 처리 — 여기서는 유저 정보 표시 목적으로만 조회
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <span className="font-semibold">소모임 이벤트 관리</span>
          <span className="text-sm text-muted-foreground">
            {user?.email ?? ""}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-5">{children}</main>
    </div>
  );
}
