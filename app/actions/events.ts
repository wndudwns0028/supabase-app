"use server";

// 이벤트 생성
export async function createEvent(
  _teamId: string,
  _data: unknown,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 이벤트 수정
export async function updateEvent(
  _eventId: string,
  _data: unknown,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 팀별 이벤트 목록 조회
export async function getEventsByTeam(
  _teamId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 이벤트 단건 조회
export async function getEventById(
  _eventId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}
