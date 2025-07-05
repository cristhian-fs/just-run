import type { Test } from "@/shared/types";
import type {
  RaceOption,
  TrainingLevel,
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
  totalVolumeMin: number;
  weekStart: Date;
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

export type FartlekOptions = {
  level: TrainingLevel;
  vam: number;
  lastUserTestData: Test;
  date: Date;
};

/**
 * Zonas de velocidade baseado para base de calculos
 */
export type RaceTarget = "v1500" | "v3000" | "v5000" | "v10k" | "v21k" | "v42k";
