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

export interface IntervalTemplate {
  name: string;
  level: TrainingLevel; // "beginner" | "intermediate" | "advanced"
  vamIntensity: number; // 0.95 = 95% da VAM
  reps: number;
  unit: TrainingUnit; // "KM" | "MINUTES"
  repsDistanceKm: number;
  repsPace?: string;
  // Durations (usadas em geração dinâmica)
  workDurationMin?: number;
  restDurationFactor?: number; // multiplicador do tempo do tiro
  restDurationSeconds?: number;

  // Warm-up/Cooldown (definido dinamicamente)
  warmUpDurationMin?: number;
  warmUpDistanceKm?: number;
  cooldownDurationMin?: number;
  cooldownDistanceKm?: number;

  restType: "active" | "passive";
  totalEstimatedDistanceKm?: number;
  targetZones?: number[];
}

export type FartlekSegment = {
  effort: "EASY" | "MODERATE" | "HARD" | "VERY_HARD";
  duration?: number; // minutes
  distance?: number; // meters
  description?: string;
};

export type FartlekTemplate = {
  name: string;
  level: TrainingLevel;
  unit: TrainingUnit;
  segments: FartlekSegment[];
  totalVolumeEstimate?: number;
};

export type GeneratedFartlek = {
  name: string;
  level: TrainingLevel;
  unit: TrainingUnit;
  segments: FartlekSegment[];
  totalVolume: number;
  intenseVolume: number;
  basedOn: string; // Nome do template usado como base
};

export type FartlekOptions = {
  level: TrainingLevel;
  unit: TrainingUnit;
  volume: number;
  intenseKms: number;
  vam: number;
};

export type ThresholdTemplate = {
  name: string;
  level: TrainingLevel;
  vamIntensity: number;
  unit: TrainingUnit;
  type: "CONTINUOUS" | "INTERVALS";
  targetZones: number[];
  reps: number;
  repsDistanceKm?: number;
  restDurationFactor?: number;
  restType?: "active" | "passive";

  // Warm-up/Cooldown (definido dinamicamente)
  warmUpDurationMin?: number;
  warmUpDistanceKm?: number;
  cooldownDurationMin?: number;
  cooldownDistanceKm?: number;

  // Durations (usadas em geração dinâmica)
  workDurationMin?: number;
  restDurationSeconds?: number;
};

export type ThresholdOptions = {
  level: TrainingLevel;
  volume: number;
  vo2Max: number;
};

export type ProgressiveWorkoutOptions = {
  level: TrainingLevel;
  vam: number; // Velocidade aeróbica máxima (em km/h)
  volume: number; // volume do dia em minutos ou km (dependendo da unidade)
  unit: TrainingUnit;
  includeWarmUp?: boolean;
};

export type ProgressiveBlock = {
  block: number;
  vamIntensity: number; // ex: 0.75 = 75% VAM
  durationMin?: number;
  distanceKm?: number;
  pace: string; // ex: "5:10/km"
  type?: "warmup" | "main" | "cooldown";
};

export type ProgressiveWorkout = {
  name: string;
  level: TrainingLevel;
  blocks: ProgressiveBlock[];
  totalVolume: number;
};

export type LongRunWorkoutOptions = {
  vam: number; // km/h
  volumeKm: number;
  level: TrainingLevel;
  includeProgression?: boolean;
};

export type LongRunBlock = {
  phase: "easy" | "steady" | "progression";
  vamIntensity: number;
  distanceKm: number;
  pace: string;
};
