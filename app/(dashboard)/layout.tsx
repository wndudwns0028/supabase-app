import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
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
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold">
              TeamPlay
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                대시보드
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/teams/new">팀 만들기</Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              {user?.email ?? ""}
            </span>
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-5">{children}</main>
    </div>
  );
}
