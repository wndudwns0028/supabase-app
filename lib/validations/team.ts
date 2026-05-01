import { z } from "zod";

import { SportType } from "@/types/domain";

export const teamSchema = z.object({
  name: z
    .string()
    .min(1, "팀 이름은 필수입니다.")
    .max(50, "팀 이름은 50자 이하여야 합니다."),
  description: z.string().optional(),
  sportType: z.nativeEnum(SportType).refine((v) => !!v, {
    message: "종목을 선택해주세요.",
  }),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
