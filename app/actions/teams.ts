"use server";

// 팀 생성
export async function createTeam(
  _data: unknown,
): Promise<{ error: string } | { success: true }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 내 팀 목록 조회
export async function getMyTeams(): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 팀 단건 조회
export async function getTeamById(_teamId: string): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 팀 멤버 목록 조회
export async function getTeamMembers(
  _teamId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 초대 토큰 재발급
export async function regenerateInviteToken(
  _teamId: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 팀 정보 수정
export async function updateTeam(
  _teamId: string,
  _data: unknown,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}

// 초대 토큰으로 팀 참여
export async function joinTeamByToken(
  _token: string,
): Promise<{ error: string }> {
  return { error: "미구현 (Phase 2에서 구현 예정)" };
}
