import { Suspense } from "react";

import Link from "next/link";

import { CalendarDays, Users, Wallet } from "lucide-react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const features = [
  {
    icon: Users,
    title: "팀 관리",
    description: "팀을 만들고 멤버를 초대하세요. 초대 링크 하나로 간편하게.",
  },
  {
    icon: CalendarDays,
    title: "이벤트 스케줄링",
    description: "운동 일정을 등록하고 참여 신청을 받아보세요.",
  },
  {
    icon: Wallet,
    title: "정산 자동화",
    description: "참가비를 1/N으로 자동 계산하고 납부 현황을 한눈에.",
  },
];

async function HeaderAuthButtons() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  if (isLoggedIn) {
    return (
      <Button asChild size="sm">
        <Link href="/dashboard">대시보드</Link>
      </Button>
    );
  }
  return (
    <div className="flex gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/auth/login">로그인</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/auth/sign-up">시작하기</Link>
      </Button>
    </div>
  );
}

async function HeroAuthButtons() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  if (isLoggedIn) {
    return (
      <Button asChild size="lg">
        <Link href="/dashboard">대시보드로 이동</Link>
      </Button>
    );
  }
  return (
    <>
      <Button asChild size="lg">
        <Link href="/auth/sign-up">무료로 시작하기</Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/auth/login">로그인</Link>
      </Button>
    </>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <span className="text-lg font-bold">TeamPlay</span>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Suspense
              fallback={
                <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
              }
            >
              <HeaderAuthButtons />
            </Suspense>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <main className="flex flex-1 flex-col">
        <section className="flex flex-col items-center gap-6 px-5 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            팀 스포츠 일정과 정산,
            <br />한 곳에서 관리하세요
          </h1>
          <p className="max-w-xl text-muted-foreground">
            팀원 초대부터 이벤트 스케줄링, 참가비 정산까지. 번거로운 단톡방
            공지는 이제 그만.
          </p>
          <div className="flex gap-3">
            <Suspense
              fallback={
                <div className="h-11 w-40 animate-pulse rounded-md bg-muted" />
              }
            >
              <HeroAuthButtons />
            </Suspense>
          </div>
        </section>

        {/* 기능 소개 */}
        <section className="border-t bg-muted/30 px-5 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © 2025 TeamPlay. All rights reserved.
      </footer>
    </div>
  );
}
