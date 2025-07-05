import type {
  raceOptions,
  segmentKinds,
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

export type Training = {
  type: TTrainingType;
  value: number;
  date: Date;
};

export type WeekAmount = (typeof WeekAmountOptions)[number];
export type TWeekType = (typeof weekTypes)[number];
export type WeekPattern = TWeekType[];
export type TTestType = (typeof testTypes)[number];
export type TSegmentKind = (typeof segmentKinds)[number];

/**
 * Segment – passo atômico dentro de um bloco (ou do treino, se bloco for nulo)
 */
export interface Segment {
  orderInBlock: number;
  segmentKind: TSegmentKind;

  // -- Alvo/Planejamento
  plannedDistanceM?: number;
  plannedDurationS?: number;
  targetPaceSPerKm?: number;
  targetHr?: number;

  // -- Se o segmento for "descanso ativo" ou intervalo parado
  restDistanceM?: number;
  restDurationS?: number;

  // -- Realizado
  actualDistanceM?: number;
  actualDurationS?: number;
  avgPaceSPerKm?: number;
  avgHr?: number;

  notes?: Array<string>;
}

/**
 * Block – agrupa segmentos que podem ser repetidos
 */
export interface Block {
  blockKind: TSegmentKind;
  repeatCount: number;
  orderIndex: number;
  description?: string;

  /* Passos pertencentes a este bloco */
  segments: Segment[];
}

/**
 * Workout – representa UMA sessão de treino, mesmo que tenha vários blocos/segmentos
 */
export interface Workout {
  scheduledStart: Date;
  runType: TTrainingType;
  title: string;
  notes?: string;

  /* ----- Planejamento ----- */
  plannedDistanceM?: number;
  plannedDurationS?: number;

  /* ----- Executado ----- */
  actualDistanceM?: number;
  actualDurationS?: number;
  avgPaceSPerKm?: number;
  avgHr?: number;
  elevationGainM?: number;

  /* Se NÃO tiver blocos, os segmentos “soltos” ficam aqui */
  segments?: Segment[];
  /* Blocos estruturados (cada um com seus próprios segments) */
  blocks?: Block[];
}

export type WorkoutSelect = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  trainingWeekId: string;
  scheduledStart: string;
  runType: TTrainingType;
  title: string | null;
  notes: string | null;
  plannedDistanceM: number | null;
  plannedDurationS: number | null;
  actualDistanceM: number | null;
  actualDurationS: number | null;
  avgPaceSPerKm: number | null;
  avgHr: number | null;
  elevationGainM: number | null;
  isCompleted: boolean;
};

export type BlockSelect = {
  id: string;
  workoutId: string;
  blockKind: TSegmentKind;
  repeatCount: number;
  orderIndex: number;
  description: string | null;
};

export type SegmentSelect = {
  id: string;
  notes: string[] | null;
  plannedDistanceM: number | null;
  plannedDurationS: number | null;
  actualDistanceM: number | null;
  actualDurationS: number | null;
  avgPaceSPerKm: number | null;
  avgHr: number | null;
  workoutId: string | null;
  blockId: string | null;
  orderInBlock: number;
  segmentKind: TSegmentKind;
  targetPaceSPerKm: number | null;
  targetHr: number | null;
  restDistanceM: number | null;
  restDurationS: number | null;
};

/**
 * Test - representa os dados de um teste adicionado pelo usuário que é retornado do banco de dados
 */
export type Test = {
  id: string;
  userId: string;
  testType: "1600m" | "2400m" | "3200m" | "3000m" | "5000m";
  distanceM: number;
  durationS: number;
  vam: number | null;
  paceMinKm: string | null;
  fcmax: number | null;
  vo2Max: number | null;
  vo2: number | null;
  testDate: string;
};

export interface Week {
  weekType: TWeekType;
  totalVolumeMin: number; // total km of the week
  workouts: Workout[];
  weekStart: Date;
}

/**
 * Training Zone
 */

export type TraningZoneSelect = {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
  workouts: string[] | null;
  vo2Percentage: number | null;
  pace: string | null;
  velocity: number | null;
  cardioFrequency: number | null;
  vo2Max: number | null;
};

export type TrainingWeekSelect = {
  id: string;
  createdAt: Date;
  userId: string;
  weekStart: string;
  weekType: TWeekType;
  totalVolumeMin: number;
};

export type PlanningSelect = TrainingWeekSelect & {
  workouts: WorkoutSelect[];
};
