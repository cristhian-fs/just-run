import { z } from "zod";

import { testTypes, trainingGoals } from "../constants/training.constants";

export const TestFormSchema = z.object({
  testType: z.enum(testTypes),
  distanceM: z.coerce
    .number()
    .min(0, { message: "A distância percorrida é obrigatória" }),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, { message: "Formato deve ser hh:mm:ss" }),
  weeklyFrequency: z.coerce.number().min(3).max(6),
  goal: z.enum(trainingGoals),
  raceDate: z.coerce.date().optional(),
  testDate: z.coerce.date(),
});

export type TestFormData = z.infer<typeof TestFormSchema>;
