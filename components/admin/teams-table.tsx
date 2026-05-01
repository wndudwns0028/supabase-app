"use client";

import { useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AdminTeam } from "@/lib/dummy-data";
import { SportType } from "@/types/domain";

const sportLabels: Record<SportType, string> = {
  [SportType.SWIMMING]: "수영",
  [SportType.FITNESS]: "헬스",
  [SportType.TABLETENNIS]: "탁구",
  [SportType.OTHER]: "기타",
};

interface TeamsTableProps {
  teams: AdminTeam[];
}

export function TeamsTable({ teams }: TeamsTableProps) {
  const [sportFilter, setSportFilter] = useState<string>("all");

  const filtered =
    sportFilter === "all"
      ? teams
      : teams.filter((t) => t.sportType === sportFilter);

  return (
    <div className="space-y-4">
      <Select value={sportFilter} onValueChange={setSportFilter}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="종목 필터" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 종목</SelectItem>
          {Object.values(SportType).map((type) => (
            <SelectItem key={type} value={type}>
              {sportLabels[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2.5 text-left font-medium">팀명</th>
              <th className="px-4 py-2.5 text-left font-medium">종목</th>
              <th className="px-4 py-2.5 text-right font-medium">멤버 수</th>
              <th className="px-4 py-2.5 text-right font-medium">이벤트 수</th>
              <th className="px-4 py-2.5 text-right font-medium">생성일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8">
                  <EmptyState
                    title="팀 없음"
                    description="해당 종목의 팀이 없습니다."
                  />
                </td>
              </tr>
            ) : (
              filtered.map((team) => (
                <tr
                  key={team.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{team.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {sportLabels[team.sportType]}
                  </td>
                  <td className="px-4 py-3 text-right">{team.memberCount}명</td>
                  <td className="px-4 py-3 text-right">{team.eventCount}개</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {new Date(team.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
