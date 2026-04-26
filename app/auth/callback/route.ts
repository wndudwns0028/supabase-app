import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 외부 사이트로의 오픈 리다이렉트를 방지하기 위해 내부 경로만 허용
  const rawNext = searchParams.get("next") ?? "/protected";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/protected";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent("인증 코드가 없습니다")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent(error.message)}`,
  );
}
