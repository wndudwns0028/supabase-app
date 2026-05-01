import { JoinTeamView } from "@/components/teams/join-team-view";
import { dummyTeams } from "@/lib/dummy-data";

interface JoinPageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { token } = await params;

  // 더미 데이터에서 토큰으로 팀 조회 (없으면 첫 번째 팀)
  const team = dummyTeams.find((t) => t.inviteToken === token) ?? dummyTeams[0];

  // Phase 1: 더미 분기 상태 (비로그인, 미가입으로 기본 설정)
  const isLoggedIn = false;
  const isAlreadyMember = false;

  return (
    <JoinTeamView
      team={team}
      isLoggedIn={isLoggedIn}
      isAlreadyMember={isAlreadyMember}
    />
  );
}
