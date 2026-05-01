"use server";

// 정산 생성
export async function createSettlement(
  _eventId: string,
  _data: unknown,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 이벤트별 정산 조회
export async function getSettlementByEvent(
  _eventId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 납부 완료 처리
export async function markAsPaid(
  _settlementItemId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 정산 완료 처리
export async function completeSettlement(
  _settlementId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}
