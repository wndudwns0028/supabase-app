import { z } from "zod";

import { EventStatus } from "@/types/domain";

export const eventSchema = z
  .object({
    title: z
      .string()
      .min(1, "이벤트 제목은 필수입니다.")
      .max(100, "제목은 100자 이하여야 합니다."),
    description: z.string().optional(),
    location: z.string().optional(),
    startsAt: z.date({ required_error: "시작 일시는 필수입니다." } as never),
    endsAt: z.date({ required_error: "종료 일시는 필수입니다." } as never),
    isUnlimited: z.boolean(),
    maxParticipants: z.number().int().positive().nullable(),
    entryFee: z.number().min(0, "참가비는 0원 이상이어야 합니다."),
    status: z.nativeEnum(EventStatus),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "종료 일시는 시작 일시보다 이후여야 합니다.",
    path: ["endsAt"],
  });

export type EventFormValues = z.infer<typeof eventSchema>;
