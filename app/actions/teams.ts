"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { SportType } from "@/types/domain";
import { Tables } from "@/types/supabase";

// ─── 반환 타입 정의 ────────────────────────────────────────────────────────────

/** 내 팀 목록에 포함되는 팀 + 내 역할 */
export interface TeamWithRole {
  id: string;
  name: string;
  description: string | null;
  sportType: SportType;
  inviteToken: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  myRole: "organizer" | "member";
}

/** 팀 상세: 멤버 목록 포함 */
export interface TeamMemberRow {
  id: string;
  teamId: string;
  userId: string;
  role: "organizer" | "member";
  joinedAt: string;
  profile: {
    username: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    email: string | null;
  } | null;
}

export interface TeamWithMembers extends TeamWithRole {
  members: TeamMemberRow[];
}

// ─── DB 행을 도메인 타입으로 변환하는 헬퍼 ───────────────────────────────────

function rowToTeamWithRole(
  team: Tables<"teams">,
  myRole: string,
): TeamWithRole {
  return {
    id: team.id,
    name: team.name,
    description: team.description ?? null,
    sportType: team.sport_type as SportType,
    inviteToken: team.invite_token,
    createdBy: team.created_by,
    createdAt: team.created_at ?? "",
    updatedAt: team.updated_at ?? "",
    myRole: myRole as "organizer" | "member",
  };
}

// ─── 팀 생성 ──────────────────────────────────────────────────────────────────

/**
 * 새 팀을 생성하고 생성자를 organizer로 team_members에 추가합니다.
 * 성공 시 { teamId } 반환, 실패 시 { error } 반환
 */
export async function createTeam(
  formData: FormData,
): Promise<{ error: string } | { teamId: string }> {
  const supabase = await createClient();

  // 인증 확인
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const sportType = formData.get("sportType")?.toString();

  if (!name) return { error: "팀 이름은 필수입니다." };
  if (!sportType) return { error: "종목을 선택해주세요." };

  // 팀 생성 (invite_token은 DB 기본값 gen_random_uuid()::text 사용)
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      name,
      description,
      sport_type: sportType,
      created_by: userId,
    })
    .select()
    .single();

  if (teamError || !team) {
    return { error: "팀 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  // 생성자를 organizer로 team_members에 추가
  const { error: memberError } = await supabase.from("team_members").insert({
    team_id: team.id,
    user_id: userId,
    role: "organizer",
  });

  if (memberError) {
    // 팀은 생성되었으나 멤버 추가 실패 — 롤백 시도
    await supabase.from("teams").delete().eq("id", team.id);
    return { error: "팀 멤버 등록에 실패했습니다. 다시 시도해 주세요." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/teams");

  return { teamId: team.id };
}

// ─── 내 팀 목록 조회 ──────────────────────────────────────────────────────────

/**
 * 현재 로그인 유저가 속한 모든 팀 목록 + 내 역할을 반환합니다.
 */
export async function getMyTeams(): Promise<
  { teams: TeamWithRole[] } | { error: string }
> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  // team_members를 통해 내가 속한 팀 + 역할 조인
  const { data, error } = await supabase
    .from("team_members")
    .select("role, teams(*)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  if (error) {
    return { error: "팀 목록을 불러오지 못했습니다." };
  }

  const teams: TeamWithRole[] = (data ?? [])
    .filter((row) => row.teams !== null)
    .map((row) =>
      rowToTeamWithRole(row.teams as unknown as Tables<"teams">, row.role),
    );

  return { teams };
}

// ─── 팀 단건 조회 (멤버 목록 포함) ───────────────────────────────────────────

/**
 * 팀 상세 정보와 멤버 목록을 반환합니다.
 * 현재 유저가 팀 멤버가 아닌 경우 에러를 반환합니다.
 */
export async function getTeamById(
  teamId: string,
): Promise<{ team: TeamWithMembers } | { error: string }> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  // 팀 정보 조회 (RLS가 멤버 아닌 경우 빈 결과 반환)
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (teamError || !team) {
    return { error: "팀을 찾을 수 없거나 접근 권한이 없습니다." };
  }

  // 내 역할 조회
  const { data: myMembership, error: myMemberError } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .single();

  if (myMemberError || !myMembership) {
    return { error: "팀 멤버가 아닙니다." };
  }

  // 전체 멤버 목록 + 프로필 조인
  const { data: membersData, error: membersError } = await supabase
    .from("team_members")
    .select("*, profiles(username, full_name, avatar_url, email)")
    .eq("team_id", teamId)
    .order("joined_at", { ascending: true });

  if (membersError) {
    return { error: "멤버 목록을 불러오지 못했습니다." };
  }

  const members: TeamMemberRow[] = (membersData ?? []).map((m) => ({
    id: m.id,
    teamId: m.team_id,
    userId: m.user_id,
    role: m.role as "organizer" | "member",
    joinedAt: m.joined_at ?? "",
    profile: m.profiles
      ? {
          username: (m.profiles as { username: string | null }).username,
          fullName: (m.profiles as { full_name: string | null }).full_name,
          avatarUrl: (m.profiles as { avatar_url: string | null }).avatar_url,
          email: (m.profiles as { email: string | null }).email,
        }
      : null,
  }));

  return {
    team: {
      ...rowToTeamWithRole(team, myMembership.role),
      members,
    },
  };
}

// ─── 팀 멤버 목록 조회 ────────────────────────────────────────────────────────

/**
 * 팀의 멤버 목록만 반환합니다. (getTeamById에 포함되지만 독립 사용 가능)
 */
export async function getTeamMembers(
  teamId: string,
): Promise<{ members: TeamMemberRow[] } | { error: string }> {
  const result = await getTeamById(teamId);
  if ("error" in result) return result;
  return { members: result.team.members };
}

// ─── 초대 토큰 재발급 ─────────────────────────────────────────────────────────

/**
 * 초대 토큰을 새로 발급합니다. organizer만 가능합니다.
 */
export async function regenerateInviteToken(
  teamId: string,
): Promise<{ error: string } | { inviteToken: string }> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  // organizer 권한 확인
  const { data: membership } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .single();

  if (!membership || membership.role !== "organizer") {
    return { error: "초대 링크 재발급은 주최자만 가능합니다." };
  }

  // SQL 함수로 uuid 생성 후 업데이트
  const { data, error } = await supabase
    .from("teams")
    .update({ invite_token: crypto.randomUUID() })
    .eq("id", teamId)
    .select("invite_token")
    .single();

  if (error || !data) {
    return { error: "초대 링크 재발급에 실패했습니다." };
  }

  revalidatePath(`/teams/${teamId}`);
  revalidatePath(`/teams/${teamId}/settings`);

  return { inviteToken: data.invite_token };
}

// ─── 팀 정보 수정 ─────────────────────────────────────────────────────────────

/**
 * 팀 이름, 설명, 종목을 수정합니다. organizer만 가능합니다.
 */
export async function updateTeam(
  teamId: string,
  formData: FormData,
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  // organizer 권한 확인
  const { data: membership } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .single();

  if (!membership || membership.role !== "organizer") {
    return { error: "팀 수정은 주최자만 가능합니다." };
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const sportType = formData.get("sportType")?.toString();

  if (!name) return { error: "팀 이름은 필수입니다." };

  const updatePayload: Record<string, unknown> = { name, description };
  if (sportType) updatePayload.sport_type = sportType;

  const { error } = await supabase
    .from("teams")
    .update(updatePayload)
    .eq("id", teamId);

  if (error) {
    return { error: "팀 정보 수정에 실패했습니다." };
  }

  revalidatePath(`/teams/${teamId}`);
  revalidatePath(`/teams/${teamId}/settings`);
  revalidatePath("/dashboard");

  return { success: true };
}

// ─── 초대 토큰으로 팀 참여 ────────────────────────────────────────────────────

/**
 * 초대 토큰을 이용해 팀에 참여합니다.
 * 이미 멤버인 경우에도 성공으로 처리합니다(멱등성).
 */
export async function joinTeamByToken(
  token: string,
): Promise<{ error: string } | { teamId: string }> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  // 토큰으로 팀 조회 (RLS 적용 전 anon 수준 — invite_token 검색이므로 별도 처리)
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id")
    .eq("invite_token", token)
    .single();

  if (teamError || !team) {
    return { error: "유효하지 않은 초대 링크입니다." };
  }

  // 이미 멤버인지 확인
  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("team_id", team.id)
    .eq("user_id", userId)
    .single();

  if (existing) {
    // 이미 멤버 — 성공으로 처리
    return { teamId: team.id };
  }

  // 멤버로 추가
  const { error: insertError } = await supabase.from("team_members").insert({
    team_id: team.id,
    user_id: userId,
    role: "member",
  });

  if (insertError) {
    return { error: "팀 참여에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/teams/${team.id}`);

  return { teamId: team.id };
}
