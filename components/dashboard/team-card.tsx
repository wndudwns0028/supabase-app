import Link from "next/link";

import { Dumbbell, TabletsIcon, Trophy, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SportType, Team, TeamMember } from "@/types/domain";

// 종목별 아이콘 매핑
const sportIconMap: Record<SportType, React.ElementType> = {
  [SportType.SWIMMING]: Waves,
  [SportType.FITNESS]: Dumbbell,
  [SportType.TABLETENNIS]: TabletsIcon,
  [SportType.OTHER]: Trophy,
};

// 종목별 레이블 매핑
const sportLabelMap: Record<SportType, string> = {
  [SportType.SWIMMING]: "수영",
  [SportType.FITNESS]: "헬스",
  [SportType.TABLETENNIS]: "탁구",
  [SportType.OTHER]: "기타",
};

interface TeamCardProps {
  team: Team;
  myMembership: TeamMember;
}

export function TeamCard({ team, myMembership }: TeamCardProps) {
  const Icon = sportIconMap[team.sportType];

  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="rounded-md bg-muted p-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <Badge
              variant={
                myMembership.role === "organizer" ? "default" : "secondary"
              }
            >
              {myMembership.role === "organizer" ? "주최자" : "멤버"}
            </Badge>
          </div>
          <CardTitle className="mt-2 text-base">{team.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {sportLabelMap[team.sportType]}
          </p>
          {team.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {team.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
