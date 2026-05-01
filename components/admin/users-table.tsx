"use client";

import { useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { type AdminUser } from "@/lib/dummy-data";

interface UsersTableProps {
  users: AdminUser[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [query, setQuery] = useState("");

  const filtered = users.filter(
    (u) =>
      u.fullName.includes(query) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="이름 또는 이메일로 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2.5 text-left font-medium">이름</th>
              <th className="px-4 py-2.5 text-left font-medium">이메일</th>
              <th className="px-4 py-2.5 text-right font-medium">소속 팀</th>
              <th className="px-4 py-2.5 text-right font-medium">가입일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8">
                  <EmptyState
                    title="검색 결과 없음"
                    description="다른 검색어를 입력해보세요."
                  />
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{user.fullName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-right">{user.teamCount}개</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("ko-KR")}
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
