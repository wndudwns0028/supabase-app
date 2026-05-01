"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type AdminSettlement } from "@/lib/dummy-data";

const STATUS_TABS = [
  { value: "all", label: "전체" },
  { value: "pending", label: "진행중" },
  { value: "completed", label: "완료" },
];

interface SettlementsTableProps {
  settlements: AdminSettlement[];
}

export function SettlementsTable({ settlements }: SettlementsTableProps) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered =
    statusFilter === "all"
      ? settlements
      : settlements.filter((s) => s.status === statusFilter);

  return (
    <div className="space-y-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2.5 text-left font-medium">이벤트명</th>
              <th className="px-4 py-2.5 text-left font-medium">팀명</th>
              <th className="px-4 py-2.5 text-right font-medium">총금액</th>
              <th className="px-4 py-2.5 text-right font-medium">납부 현황</th>
              <th className="px-4 py-2.5 text-center font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8">
                  <EmptyState
                    title="정산 없음"
                    description="해당 상태의 정산이 없습니다."
                  />
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{s.eventTitle}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.teamName}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.totalAmount.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.paidCount}/{s.totalCount}명
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={s.status === "completed" ? "default" : "outline"}
                    >
                      {s.status === "completed" ? "완료" : "진행중"}
                    </Badge>
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
