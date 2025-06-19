import { z } from "zod";

import { testTypes, trainingGoals } from "../constants/training.constants";

export const onboardingSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  gender: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(0).max(120),
  weightKg: z.coerce
    .number()
    .min(0, { message: "O peso é obrigatório" })
    .max(300),
  heightCm: z.coerce
    .number()
    .min(0, { message: "A altura é obrigatória" })
    .max(300),
  testType: z.enum(testTypes),
  distanceM: z.coerce
    .number()
    .min(0, { message: "A distância percorrida é obrigatória" }),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, { message: "Formato deve ser hh:mm:ss" }),
  weeklyFrequency: z.coerce.number().min(3).max(6),
  trainingLevel: z.enum(["beginner", "intermediate", "advanced"]),
  goal: z.enum(trainingGoals),
});
