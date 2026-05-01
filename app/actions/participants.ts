"use server";

// 이벤트 참여 신청
export async function applyToEvent(
  _eventId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 참여 취소
export async function cancelParticipation(
  _participantId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 이벤트 참여자 목록 조회
export async function getParticipantsByEvent(
  _eventId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 참여자 확정 처리
export async function confirmParticipant(
  _participantId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 참여자 강제 취소
export async function forceCancel(
  _participantId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}
