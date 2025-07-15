import { z } from "zod";

import {
  raceOptions,
  testTypes,
  trainingGoals,
  trainingTypes,
} from "../constants/training.constants";

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

export const registerWorkoutSchema = z.object({
  date: z.coerce.date({
    required_error: "Data é obrigatória",
  }),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  runType: z.enum(trainingTypes),
  workoutType: z.enum(["Treino completo", "treino pulado", "treino parcial"], {
    required_error: "Selecione o tipo de treino",
  }),
  duration: z
    .string()
    .regex(
      /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/,
      "Formato de duração inválido (HH:MM:SS)",
    ),
  distance: z
    .string()
    .min(1, "Distância é obrigatória")
    .refine((val) => {
      const num = Number.parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Distância deve ser um número positivo"),
  perceivedEffort: z.string(),
  observations: z.string().optional(),
});

export type RegisterWorkoutFormData = z.infer<typeof registerWorkoutSchema>;

export const newPeriodizationPlanSchema = z.object({
  weeks: z.coerce.number(),
  race: z.enum(raceOptions),
  baseValuePerWeek: z.coerce.number(),
  weeklyFrequency: z.coerce.number().min(3).max(6),
  unit: z.enum(["KM", "MINUTES"]),
  startDate: z.coerce.date({
    required_error: "Data é obrigatória",
  }),
});

export type NewPeriodizationPlanFormData = z.infer<
  typeof newPeriodizationPlanSchema
>;
