export const trainingGoals = [
  "startRunning",
  "improveHealth",
  "loseWeight",
  "runFaster",
  "runLonger",
  "race5K",
  "race10K",
  "race21K",
  "race42K",
] as const;

export const raceOptions = ["5K", "10K", "21K", "42K"] as const;

export const weekTypes = [
  "INTRO", // Introdutório
  "TEST", // Semana de teste
  "BASE", // Volume moderado, foco técnico
  "BUILD", // Intensidade crescente
  "PEAK", // Pré-competição
  "TAPER", // Ajuste antes da prova
  "DELOAD", // Recuperação ativa
  "COMPETITION", // Semana da prova
] as const;

export const trainingTypes = [
  "EASY_RUN",
  "LONG_RUN",
  "INTERVAL",
  "FARTLEK",
  "PROGRESSIVE_RUN",
  "REPETITION",
  "RECOVERY_RUN",
  "THRESHOLD_RUN",
] as const;

export const WeekAmountOptions = [8, 12, 16, 20, 24] as const;

export const testTypes = ["1600m", "2400m", "3200m", "3000m", "5000m"] as const;

export const segmentKinds = [
  "WORK",
  "REST",
  "FLOAT",
  "THRESHOLD",
  "PROGRESSIVE",
  "WARMUP",
  "COOLDOWN",
] as const;
