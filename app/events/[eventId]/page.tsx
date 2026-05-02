import { notFound } from "next/navigation";

import { Metadata } from "next";

import { PublicEventView } from "@/components/events/public-event-view";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { Event, EventStatus } from "@/types/domain";

interface EventPublicPageProps {
  params: Promise<{ eventId: string }>;
}

// ─── 이벤트 조회 헬퍼 ────────────────────────────────────────────────────────

async function fetchPublicEvent(eventId: string): Promise<Event | null> {
  // 비인증 클라이언트로 open 이벤트 조회 (RLS: status = 'open' 허용)
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("status", "open")
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    teamId: data.team_id,
    createdBy: data.created_by,
    title: data.title,
    description: data.description ?? undefined,
    location: data.location ?? undefined,
    startsAt: new Date(data.starts_at),
    endsAt: new Date(data.ends_at),
    maxParticipants: data.max_participants ?? null,
    entryFee: data.entry_fee,
    status: data.status as EventStatus,
    createdAt: data.created_at ?? "",
    updatedAt: data.updated_at ?? "",
  };
}

// ─── SEO 메타데이터 동적 생성 ────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: EventPublicPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await fetchPublicEvent(eventId);

  if (!event) {
    return { title: "이벤트를 찾을 수 없습니다." };
  }

  return {
    title: event.title,
    description:
      event.description ?? `${event.title} 이벤트 참여 신청 페이지입니다.`,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
    },
  };
}

// ─── 공개 이벤트 페이지 ──────────────────────────────────────────────────────

export default async function EventPublicPage({
  params,
}: EventPublicPageProps) {
  const { eventId } = await params;

  const event = await fetchPublicEvent(eventId);

  // open 이벤트가 아니거나 존재하지 않으면 404
  if (!event) {
    notFound();
  }

  // 로그인 여부 확인
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const isLoggedIn = !!claimsData?.claims?.sub;

  return <PublicEventView event={event} isLoggedIn={isLoggedIn} />;
}
