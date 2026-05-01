import { z } from "zod";

export const settlementSchema = z.object({
  totalAmount: z
    .number()
    .int("정수를 입력하세요.")
    .positive("총비용은 0원보다 커야 합니다."),
  memo: z.string().optional(),
});

export type SettlementFormValues = z.infer<typeof settlementSchema>;
