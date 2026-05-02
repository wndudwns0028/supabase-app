"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { EventStatus } from "@/types/domain";
import { Tables } from "@/types/supabase";

// ─── 반환 타입 정의 ────────────────────────────────────────────────────────────

/** 이벤트 목록 아이템: 확정 참여자 수 포함 */
export interface EventWithCount {
  id: string;
  teamId: string;
  createdBy: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date;
  maxParticipants: number | null;
  entryFee: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  confirmedCount: number;
}

/** 참여자 상세 정보 */
export interface ParticipantDetail {
  id: string;
  userId: string;
  status: "confirmed" | "waitlisted" | "cancelled";
  note: string | null;
  createdAt: string;
  profile: {
    username: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    email: string | null;
  } | null;
}

/** 이벤트 상세: 참여 현황 포함 */
export interface EventWithDetails extends EventWithCount {
  participants: ParticipantDetail[];
}

// ─── DB 행을 도메인 타입으로 변환하는 헬퍼 ───────────────────────────────────

function rowToEventWithCount(
  row: Tables<"events">,
  confirmedCount: number,
): EventWithCount {
  return {
    id: row.id,
    teamId: row.team_id,
    createdBy: row.created_by,
    title: row.title,
    description: row.description ?? null,
    location: row.location ?? null,
    startsAt: new Date(row.starts_at),
    endsAt: new Date(row.ends_at),
    maxParticipants: row.max_participants ?? null,
    entryFee: row.entry_fee,
    status: row.status as EventStatus,
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
    confirmedCount,
  };
}

// ─── organizer 권한 확인 헬퍼 ────────────────────────────────────────────────

async function checkOrganizerRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teamId: string,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .single();
  return data?.role === "organizer";
}

// ─── 이벤트 생성 ──────────────────────────────────────────────────────────────

/**
 * 이벤트를 생성합니다. organizer 권한이 필요합니다.
 * 성공 시 { eventId } 반환, 실패 시 { error } 반환
 */
export async function createEvent(
  teamId: string,
  formData: FormData,
): Promise<{ error: string } | { eventId: string }> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  // organizer 권한 확인
  const isOrganizer = await checkOrganizerRole(supabase, teamId, userId);
  if (!isOrganizer) {
    return { error: "이벤트 생성은 주최자만 가능합니다." };
  }

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const location = formData.get("location")?.toString().trim() || null;
  const startsAt = formData.get("startsAt")?.toString();
  const endsAt = formData.get("endsAt")?.toString();
  const maxParticipantsRaw = formData.get("maxParticipants")?.toString();
  const isUnlimited = formData.get("isUnlimited") === "true";
  const entryFeeRaw = formData.get("entryFee")?.toString() ?? "0";
  const status = formData.get("status")?.toString() ?? "draft";

  if (!title) return { error: "이벤트 제목은 필수입니다." };
  if (!startsAt) return { error: "시작 일시는 필수입니다." };
  if (!endsAt) return { error: "종료 일시는 필수입니다." };

  const maxParticipants =
    isUnlimited || !maxParticipantsRaw
      ? null
      : parseInt(maxParticipantsRaw, 10);
  const entryFee = parseInt(entryFeeRaw, 10) || 0;

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      team_id: teamId,
      created_by: userId,
      title,
      description,
      location,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      max_participants: maxParticipants,
      entry_fee: entryFee,
      status,
    })
    .select()
    .single();

  if (error || !event) {
    return { error: "이벤트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath(`/teams/${teamId}`);
  revalidatePath(`/teams/${teamId}/events/${event.id}`);

  return { eventId: event.id };
}

// ─── 이벤트 수정 ──────────────────────────────────────────────────────────────

/**
 * 이벤트를 수정합니다. organizer 권한이 필요합니다.
 */
export async function updateEvent(
  eventId: string,
  formData: FormData,
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = claimsData.claims.sub;

  // 이벤트 조회 (팀 ID 획득)
  const { data: existingEvent, error: fetchError } = await supabase
    .from("events")
    .select("team_id")
    .eq("id", eventId)
    .single();

  if (fetchError || !existingEvent) {
    return { error: "이벤트를 찾을 수 없습니다." };
  }

  // organizer 권한 확인
  const isOrganizer = await checkOrganizerRole(
    supabase,
    existingEvent.team_id,
    userId,
  );
  if (!isOrganizer) {
    return { error: "이벤트 수정은 주최자만 가능합니다." };
  }

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const location = formData.get("location")?.toString().trim() || null;
  const startsAt = formData.get("startsAt")?.toString();
  const endsAt = formData.get("endsAt")?.toString();
  const maxParticipantsRaw = formData.get("maxParticipants")?.toString();
  const isUnlimited = formData.get("isUnlimited") === "true";
  const entryFeeRaw = formData.get("entryFee")?.toString() ?? "0";
  const status = formData.get("status")?.toString();

  if (!title) return { error: "이벤트 제목은 필수입니다." };
  if (!startsAt) return { error: "시작 일시는 필수입니다." };
  if (!endsAt) return { error: "종료 일시는 필수입니다." };

  const maxParticipants =
    isUnlimited || !maxParticipantsRaw
      ? null
      : parseInt(maxParticipantsRaw, 10);
  const entryFee = parseInt(entryFeeRaw, 10) || 0;

  const updatePayload: Record<string, unknown> = {
    title,
    description,
    location,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: new Date(endsAt).toISOString(),
    max_participants: maxParticipants,
    entry_fee: entryFee,
  };
  if (status) updatePayload.status = status;

  const { error } = await supabase
    .from("events")
    .update(updatePayload)
    .eq("id", eventId);

  if (error) {
    return { error: "이벤트 수정에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath(`/teams/${existingEvent.team_id}`);
  revalidatePath(`/teams/${existingEvent.team_id}/events/${eventId}`);
  revalidatePath(`/events/${eventId}`);

  return { success: true };
}

// ─── 팀별 이벤트 목록 조회 ────────────────────────────────────────────────────

/**
 * 팀의 이벤트 목록을 확정 참여자 수와 함께 반환합니다.
 * 팀 멤버만 조회 가능합니다.
 */
export async function getEventsByTeam(
  teamId: string,
): Promise<{ events: EventWithCount[] } | { error: string }> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) {
    return { error: "로그인이 필요합니다." };
  }

  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .eq("team_id", teamId)
    .order("starts_at", { ascending: false });

  if (eventsError) {
    return { error: "이벤트 목록을 불러오지 못했습니다." };
  }

  // 각 이벤트의 확정 참여자 수 조회
  // event_participants 테이블이 Phase 2에서는 아직 미생성이므로 0으로 처리
  // Phase 3(참여자 기능)에서 실제 집계로 교체 예정
  const events: EventWithCount[] = (eventsData ?? []).map((row) =>
    rowToEventWithCount(row, 0),
  );

  return { events };
}

// ─── 이벤트 단건 조회 ────────────────────────────────────────────────────────

/**
 * 이벤트 상세 + 참여 현황을 반환합니다.
 * status = 'open'이면 비인증 조회도 지원합니다.
 */
export async function getEventById(
  eventId: string,
): Promise<{ event: EventWithDetails } | { error: string }> {
  const supabase = await createClient();

  const { data: eventRow, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (eventError || !eventRow) {
    return { error: "이벤트를 찾을 수 없습니다." };
  }

  // 비인증 사용자가 non-open 이벤트에 접근하는 경우 RLS가 차단
  // 인증 유저라면 팀 멤버 여부는 RLS가 처리함

  // 참여자 목록 조회 (event_participants는 Phase 3에서 생성)
  // 현재는 빈 배열로 처리
  const participants: ParticipantDetail[] = [];

  return {
    event: {
      ...rowToEventWithCount(eventRow, 0),
      participants,
    },
  };
}
