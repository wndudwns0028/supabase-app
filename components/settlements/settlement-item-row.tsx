"use client";

import { useState } from "react";

import { Check, UserCircle } from "lucide-react";

import { markAsPaid } from "@/app/actions/settlements";
import { Button } from "@/components/ui/button";
import { PaidStatusBadge } from "@/components/ui/status-badge";
import { PaidStatus, SettlementItem } from "@/types/domain";

interface SettlementItemRowProps {
  item: SettlementItem;
  isOrganizer: boolean;
  onPaidChange?: (id: string, status: PaidStatus) => void;
}

export function SettlementItemRow({
  item,
  isOrganizer,
  onPaidChange,
}: SettlementItemRowProps) {
  const [paidStatus, setPaidStatus] = useState<PaidStatus>(item.paidStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsPaid = async () => {
    setIsLoading(true);
    try {
      await markAsPaid(item.id);
      setPaidStatus(PaidStatus.PAID);
      onPaidChange?.(item.id, PaidStatus.PAID);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <UserCircle className="h-8 w-8 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{item.userId}</span>
          <PaidStatusBadge status={paidStatus} />
        </div>
        <p className="text-sm font-semibold">
          {item.amount.toLocaleString()}원
        </p>
        {item.paidAt && (
          <p className="text-xs text-muted-foreground">
            납부일: {new Date(item.paidAt).toLocaleDateString("ko-KR")}
          </p>
        )}
      </div>
      {/* organizer 전용 납부 확인 버튼 — 미납 상태일 때만 표시 */}
      {isOrganizer && paidStatus === PaidStatus.UNPAID && (
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={handleMarkAsPaid}
        >
          <Check className="mr-1.5 h-4 w-4" />
          {isLoading ? "처리 중..." : "납부 확인"}
        </Button>
      )}
    </div>
  );
}
