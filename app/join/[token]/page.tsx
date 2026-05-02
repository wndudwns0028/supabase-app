import { notFound } from "next/navigation";

import { JoinTeamView } from "@/components/teams/join-team-view";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { SportType, Team } from "@/types/domain";

interface JoinPageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { token } = await params;

  // 비인증 클라이언트로 초대 토큰으로 팀 조회
  // invite_token은 unique 컬럼이므로 공개 조회 허용 (RLS SELECT는 멤버 한정이지만
  // 초대 링크 접근 시 팀 정보 노출은 의도된 동작)
  const publicSupabase = createPublicClient();
  const { data: teamRow, error: teamError } = await publicSupabase
    .from("teams")
    .select("*")
    .eq("invite_token", token)
    .single();

  // 유효하지 않은 토큰이면 404
  if (teamError || !teamRow) {
    notFound();
  }

  const team: Team = {
    id: teamRow.id,
    name: teamRow.name,
    description: teamRow.description ?? undefined,
    sportType: teamRow.sport_type as SportType,
    inviteToken: teamRow.invite_token,
    createdBy: teamRow.created_by,
    createdAt: teamRow.created_at ?? "",
    updatedAt: teamRow.updated_at ?? "",
  };

  // 로그인 여부 및 이미 멤버인지 확인
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ?? null;
  const isLoggedIn = !!userId;

  let isAlreadyMember = false;
  if (isLoggedIn && userId) {
    const { data: membership } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", team.id)
      .eq("user_id", userId)
      .single();
    isAlreadyMember = !!membership;
  }

  return (
    <JoinTeamView
      team={team}
      isLoggedIn={isLoggedIn}
      isAlreadyMember={isAlreadyMember}
    />
  );
}
