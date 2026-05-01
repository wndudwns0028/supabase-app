interface AmountPreviewProps {
  totalAmount: number;
  confirmedCount: number;
}

export function AmountPreview({
  totalAmount,
  confirmedCount,
}: AmountPreviewProps) {
  if (!totalAmount || confirmedCount === 0) return null;

  // 1/N 균등 분배 계산
  const perPerson = Math.floor(totalAmount / confirmedCount);
  const remainder = totalAmount % confirmedCount;

  return (
    <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
      <p className="font-medium">정산 미리보기</p>
      <div className="flex justify-between">
        <span className="text-muted-foreground">참여 인원</span>
        <span>{confirmedCount}명</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">1인당 금액</span>
        <span className="font-semibold">{perPerson.toLocaleString()}원</span>
      </div>
      {remainder > 0 && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>나머지 (주최자 부담)</span>
          <span>+{remainder.toLocaleString()}원</span>
        </div>
      )}
    </div>
  );
}
