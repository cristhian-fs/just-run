import type {
  RaceOption,
  TTrainingType,
  TWeekType,
} from "@/shared/types/training.types";

export type TrainingZone = {
  name: string;
  workouts: TTrainingType[];
  vo2Percentage: number;
  pace: string;
  velocity: number;
  cardioFrequency: number;
  vo2Max: number;
};

export type GoalMapping = {
  race: RaceOption;
  weeklyKm: number;
};

export type TrainingUnit = "KM" | "MINUTES";

export type WeeklyKmTrainingDistribution = {
  weekType: TWeekType;
  value: number;
  trainings: {
    type: TTrainingType;
    value: number;
  }[];
};

export interface UserTestData {
  vo2Max: number;
  vam: number;
  trainingZones: TrainingZone[];
}
