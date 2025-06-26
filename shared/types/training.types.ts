import type {
  raceOptions,
  testTypes,
  trainingGoals,
  trainingTypes,
  WeekAmountOptions,
  weekTypes,
} from "../constants/training.constants";

export type TrainingGoal = (typeof trainingGoals)[number];
export type RaceOption = (typeof raceOptions)[number];
export type TTrainingType = (typeof trainingTypes)[number];
export type SessionVolumeDistribution = Record<
  number, // número de treinos por semana (3, 4, 5, 6)
  Partial<Record<TTrainingType, number>>
>;

export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export type TrainingGoalConfig = {
  durationWeeks: number;
  initialWeeklyMinutes: number;
  peakWeeklyMinutes: number;
  recommendedFrequency: number;
  includeTaper: boolean;
  includeDeload: boolean;
  deloadEvery: number; // a cada X semanas
  intensityProfile: "low" | "moderate" | "high";
  periodization: "linear" | "undulating" | "polarized";
};

export type WeekAmount = (typeof WeekAmountOptions)[number];

export type TWeekType = (typeof weekTypes)[number];

export type WeekPattern = TWeekType[];

export type TTestType = (typeof testTypes)[number];

export type Training = {
  type: TTrainingType;
  value: number; // total km
  date: Date;
};

export interface Week {
  weekType: TWeekType;
  totalVolumeMin: number; // total km of the week
  trainings: Training[];
  weekStart: Date;
}
