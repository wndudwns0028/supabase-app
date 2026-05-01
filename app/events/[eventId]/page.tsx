import { Metadata } from "next";

import { PublicEventView } from "@/components/events/public-event-view";
import { dummyEvents } from "@/lib/dummy-data";

interface EventPublicPageProps {
  params: Promise<{ eventId: string }>;
}

// SEO 메타데이터 동적 생성
export async function generateMetadata({
  params,
}: EventPublicPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = dummyEvents.find((e) => e.id === eventId) ?? dummyEvents[0];

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

export default async function EventPublicPage({
  params,
}: EventPublicPageProps) {
  const { eventId } = await params;
  const event = dummyEvents.find((e) => e.id === eventId) ?? dummyEvents[0];

  // Phase 1: 더미 로그인 상태 (false = 비로그인으로 분기 확인)
  const isLoggedIn = false;

  return <PublicEventView event={event} isLoggedIn={isLoggedIn} />;
}
