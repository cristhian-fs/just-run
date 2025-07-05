import type { RaceTarget } from "../types";

// Tipos de treino por intensidade/impacto
export const TRAINING_INTENSITY = {
  LOW: ["EASY_RUN", "RECOVERY_RUN"],
  MODERATE: ["PROGRESSIVE_RUN", "FARTLEK"],
  HIGH: ["INTERVAL", "THRESHOLD_RUN", "REPETITION"],
  SPECIAL: ["LONG_RUN"], // Treino longo tem regras especiais
} as const;

// Template melhorado com dias únicos e melhor organização
export const WEEKLY_TEMPLATES = {
  3: {
    pattern: [
      { day: 1, intensities: ["MODERATE", "HIGH"] }, // Segunda
      { day: 3, intensities: ["HIGH", "MODERATE"] }, // Quarta
      { day: 6, intensities: ["SPECIAL"] }, // Sábado
    ],
  },
  4: {
    pattern: [
      { day: 1, intensities: ["MODERATE"] }, // Segunda
      { day: 3, intensities: ["HIGH"] }, // Quarta
      { day: 5, intensities: ["MODERATE", "HIGH"] }, // Sexta
      { day: 0, intensities: ["SPECIAL"] }, // Domingo
    ],
  },
  5: {
    pattern: [
      { day: 1, intensities: ["LOW"] }, // Segunda
      { day: 2, intensities: ["HIGH"] }, // Terça
      { day: 4, intensities: ["MODERATE"] }, // Quinta
      { day: 5, intensities: ["HIGH"] }, // Sexta
      { day: 0, intensities: ["SPECIAL"] }, // Domingo
    ],
  },
  6: {
    pattern: [
      { day: 1, intensities: ["LOW"] }, // Segunda
      { day: 2, intensities: ["HIGH"] }, // Terça
      { day: 3, intensities: ["MODERATE"] }, // Quarta - mudei de quinta para quarta
      { day: 4, intensities: ["LOW"] }, // Quinta - mudei para quinta
      { day: 5, intensities: ["HIGH"] }, // Sexta
      { day: 0, intensities: ["SPECIAL"] }, // Domingo
    ],
  },
} as const;

export const raceDistances: Record<RaceTarget, number> = {
  v1500: 1500,
  v3000: 3000,
  v5000: 5000,
  v10k: 10000,
  v21k: 21097,
  v42k: 42195,
};
