"use client";

import { useState } from "react";

import { completeSettlement } from "@/app/actions/settlements";
import { SettlementItemRow } from "@/components/settlements/settlement-item-row";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PaidStatus, Settlement, SettlementItem } from "@/types/domain";

interface SettlementStatusViewProps {
  settlement: Settlement;
  items: SettlementItem[];
  isOrganizer: boolean;
}

export function SettlementStatusView({
  settlement,
  items,
  isOrganizer,
}: SettlementStatusViewProps) {
  const [paidStatuses, setPaidStatuses] = useState<Record<string, PaidStatus>>(
    Object.fromEntries(items.map((i) => [i.id, i.paidStatus])),
  );
  const [isCompleting, setIsCompleting] = useState(false);

  const allPaid = Object.values(paidStatuses).every(
    (s) => s === PaidStatus.PAID,
  );

  const handlePaidChange = (id: string, status: PaidStatus) => {
    setPaidStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeSettlement(settlement.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const perPerson =
    items.length > 0 ? Math.floor(settlement.totalAmount / items.length) : 0;

  return (
    <div className="space-y-6">
      {/* 정산 요약 카드 */}
      <div className="space-y-3 rounded-lg border p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">총비용</span>
          <span className="font-semibold">
            {settlement.totalAmount.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">인당 금액</span>
          <span className="font-semibold">{perPerson.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">납부 현황</span>
          <span>
            {
              Object.values(paidStatuses).filter((s) => s === PaidStatus.PAID)
                .length
            }
            /{items.length}명 납부
          </span>
        </div>
        {settlement.memo && (
          <p className="border-t pt-2 text-xs text-muted-foreground">
            {settlement.memo}
          </p>
        )}
      </div>

      <Separator />

      {/* 참가자별 납부 현황 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">참가자별 납부 현황</h3>
        {items.map((item) => (
          <SettlementItemRow
            key={item.id}
            item={item}
            isOrganizer={isOrganizer}
            onPaidChange={handlePaidChange}
          />
        ))}
      </div>

      {/* organizer 전용 정산 완료 버튼 — 전원 납부 완료 시 활성화 */}
      {isOrganizer && settlement.status === "pending" && (
        <Button
          className="w-full"
          disabled={!allPaid || isCompleting}
          onClick={handleComplete}
        >
          {isCompleting
            ? "처리 중..."
            : allPaid
              ? "정산 완료 처리"
              : "전원 납부 완료 후 정산 완료 가능"}
        </Button>
      )}
    </div>
  );
}
