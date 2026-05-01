"use client";

import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold">
            소모임 매니저
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
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="default">
            <Link href="/teams/new">팀 만들기</Link>
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
