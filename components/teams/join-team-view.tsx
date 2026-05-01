import Link from "next/link";

import { Dumbbell, TabletsIcon, Trophy, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SportType, Team } from "@/types/domain";

const sportIconMap: Record<SportType, React.ElementType> = {
  [SportType.SWIMMING]: Waves,
  [SportType.FITNESS]: Dumbbell,
  [SportType.TABLETENNIS]: TabletsIcon,
  [SportType.OTHER]: Trophy,
};

const sportLabelMap: Record<SportType, string> = {
  [SportType.SWIMMING]: "수영",
  [SportType.FITNESS]: "헬스",
  [SportType.TABLETENNIS]: "탁구",
  [SportType.OTHER]: "기타",
};

interface JoinTeamViewProps {
  team: Team;
  // Phase 1 더미 분기 상태
  isLoggedIn: boolean;
  isAlreadyMember: boolean;
}

export function JoinTeamView({
  team,
  isLoggedIn,
  isAlreadyMember,
}: JoinTeamViewProps) {
  const Icon = sportIconMap[team.sportType];

  // 이미 멤버인 경우 안내
  if (isAlreadyMember) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>이미 팀 멤버입니다</CardTitle>
            <CardDescription>{team.name}의 멤버입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/teams/${team.id}`}>팀 홈으로 이동</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 비로그인 유도
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Icon className="h-7 w-7 text-muted-foreground" />
            </div>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>
              {sportLabelMap[team.sportType]} 팀에 초대되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              팀에 합류하려면 로그인이 필요합니다.
            </p>
            <Button asChild className="w-full">
              <Link href={`/auth/login?redirectTo=/join/${team.inviteToken}`}>
                로그인 후 팀 합류
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 로그인 상태 — 팀 합류 버튼
  return (
    <div className="mx-auto max-w-sm py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Icon className="h-7 w-7 text-muted-foreground" />
          </div>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription>
            {sportLabelMap[team.sportType]} 팀에 초대되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {team.description && (
            <p className="text-sm text-muted-foreground">{team.description}</p>
          )}
          <Button className="w-full" size="lg">
            팀 합류하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
