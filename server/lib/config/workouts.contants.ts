import type {
  FartlekTemplate,
  IntervalTemplate,
  ThresholdTemplate,
} from "../types";

export const INTERVAL_PATTERNS: IntervalTemplate[] = [
  // 👶 BEGINNER - Foco em adaptação aeróbica
  {
    name: "6 x 1min",
    level: "beginner",
    vamIntensity: 0.85,
    reps: 6,
    repsDistanceKm: 0.18,
    restDurationFactor: 2.0,
    restType: "passive",
    targetZones: [3],
    unit: "MINUTES",
  },
  {
    name: "4 x 2min",
    level: "beginner",
    vamIntensity: 0.82,
    reps: 4,
    repsDistanceKm: 0.25,
    restDurationFactor: 1.5,
    restType: "passive",
    targetZones: [3],
    unit: "MINUTES",
  },
  {
    name: "8 x 30seg",
    level: "beginner",
    vamIntensity: 0.9,
    reps: 8,
    repsDistanceKm: 0.12,
    restDurationFactor: 3.0,
    restType: "passive",
    targetZones: [3, 4],
    unit: "MINUTES",
  },
  {
    name: "5 x 400m",
    level: "beginner",
    vamIntensity: 0.88,
    reps: 5,
    repsDistanceKm: 0.4,
    restDurationFactor: 2.0,
    restType: "passive",
    targetZones: [3],
    unit: "KM",
  },
  {
    name: "3 x 600m",
    level: "beginner",
    vamIntensity: 0.85,
    reps: 3,
    repsDistanceKm: 0.6,
    restDurationFactor: 1.8,
    restType: "passive",
    targetZones: [3],
    unit: "KM",
  },

  // 🏃 INTERMEDIATE - Desenvolvimento de velocidade e resistência
  {
    name: "8 x 400m",
    level: "intermediate",
    vamIntensity: 0.95,
    reps: 8,
    repsDistanceKm: 0.4,
    restDurationFactor: 1.5,
    restType: "active",
    targetZones: [4],
    unit: "KM",
  },
  {
    name: "6 x 2min",
    level: "intermediate",
    vamIntensity: 0.88,
    reps: 6,
    repsDistanceKm: 0.32,
    restDurationFactor: 1.0,
    restType: "active",
    targetZones: [3, 4],
    unit: "MINUTES",
  },
  {
    name: "5 x 3min",
    level: "intermediate",
    vamIntensity: 0.85,
    reps: 5,
    repsDistanceKm: 0.45,
    restDurationFactor: 0.8,
    restType: "active",
    targetZones: [3, 4],
    unit: "MINUTES",
  },
  {
    name: "4 x 1km",
    level: "intermediate",
    vamIntensity: 0.9,
    reps: 4,
    repsDistanceKm: 1.0,
    restDurationFactor: 1.2,
    restType: "active",
    targetZones: [4],
    unit: "KM",
  },
  {
    name: "10 x 200m",
    level: "intermediate",
    vamIntensity: 1.0,
    reps: 10,
    repsDistanceKm: 0.2,
    restDurationFactor: 2.0,
    restType: "passive",
    targetZones: [4, 5],
    unit: "KM",
  },

  // 💪 ADVANCED - Treinos de alta intensidade
  {
    name: "8 x 1km",
    level: "advanced",
    vamIntensity: 0.94,
    reps: 8,
    repsDistanceKm: 1.0,
    restDurationFactor: 0.6,
    restType: "active",
    targetZones: [4, 5],
    unit: "KM",
  },
  {
    name: "6 x 5min",
    level: "advanced",
    vamIntensity: 0.9,
    reps: 6,
    repsDistanceKm: 0.75,
    restDurationFactor: 0.5,
    restType: "active",
    targetZones: [4],
    unit: "MINUTES",
  },
  {
    name: "2 x (4 x 400m)",
    level: "advanced",
    vamIntensity: 0.98,
    reps: 8, // 2 blocos de 4
    repsDistanceKm: 0.4,
    restDurationFactor: 1.2, // Entre reps; 3min entre blocos
    restType: "active",
    targetZones: [5],
    unit: "KM",
  },
  {
    name: "3 x 1600m",
    level: "advanced",
    vamIntensity: 0.91,
    reps: 3,
    repsDistanceKm: 1.6,
    restDurationFactor: 1.0,
    restType: "active",
    targetZones: [4],
    unit: "KM",
  },
];

export const FARTLEK_PATTERNS: FartlekTemplate[] = [
  // 👶 BEGINNER - Adaptação e introdução ao treino variado
  {
    name: "Piramidal Clássico",
    level: "beginner",
    unit: "MINUTES",
    segments: [
      { effort: "MODERATE", duration: 1 },
      { effort: "EASY", duration: 1 },
      { effort: "MODERATE", duration: 2 },
      { effort: "EASY", duration: 2 },
      { effort: "MODERATE", duration: 3 },
      { effort: "EASY", duration: 3 },
    ],
    totalVolumeEstimate: 12,
  },
  {
    name: "Ondas Suaves",
    level: "beginner",
    unit: "MINUTES",
    segments: Array(8)
      .fill(null)
      .flatMap(() => [
        { effort: "MODERATE", duration: 1 },
        { effort: "EASY", duration: 2 },
      ]),
    totalVolumeEstimate: 24,
  },
  {
    name: "Progressão Gradual",
    level: "beginner",
    unit: "MINUTES",
    segments: [
      { effort: "EASY", duration: 3 },
      { effort: "MODERATE", duration: 1 },
      { effort: "EASY", duration: 2 },
      { effort: "MODERATE", duration: 1.5 },
      { effort: "EASY", duration: 2 },
      { effort: "MODERATE", duration: 2 },
      { effort: "EASY", duration: 3 },
    ],
    totalVolumeEstimate: 14.5,
  },
  {
    name: "Lampejos Curtos",
    level: "beginner",
    unit: "MINUTES",
    segments: Array(10)
      .fill(null)
      .flatMap(() => [
        { effort: "MODERATE", duration: 0.5 },
        { effort: "EASY", duration: 1.5 },
      ]),
    totalVolumeEstimate: 20,
  },

  // 🏃 INTERMEDIATE - Desenvolvimento de resistência e velocidade
  {
    name: "Fartlek 2:1",
    level: "intermediate",
    unit: "MINUTES",
    segments: Array(6)
      .fill(null)
      .flatMap(() => [
        { effort: "HARD", duration: 2 },
        { effort: "EASY", duration: 1 },
      ]),
    totalVolumeEstimate: 18,
  },
  {
    name: "Surge aleatório",
    level: "intermediate",
    unit: "MINUTES",
    segments: [
      { effort: "MODERATE", duration: 3 },
      { effort: "HARD", duration: 1 },
      { effort: "EASY", duration: 2 },
      { effort: "HARD", duration: 2 },
      { effort: "MODERATE", duration: 4 },
    ],
    totalVolumeEstimate: 12,
  },
  {
    name: "Escada Dupla",
    level: "intermediate",
    unit: "MINUTES",
    segments: [
      { effort: "MODERATE", duration: 1 },
      { effort: "EASY", duration: 1 },
      { effort: "HARD", duration: 2 },
      { effort: "EASY", duration: 1.5 },
      { effort: "HARD", duration: 3 },
      { effort: "EASY", duration: 2 },
      { effort: "HARD", duration: 2 },
      { effort: "EASY", duration: 1.5 },
      { effort: "MODERATE", duration: 1 },
    ],
    totalVolumeEstimate: 15,
  },
  {
    name: "Blocos Alternados",
    level: "intermediate",
    unit: "MINUTES",
    segments: Array(4)
      .fill(null)
      .flatMap(() => [
        { effort: "HARD", duration: 3 },
        { effort: "MODERATE", duration: 1 },
        { effort: "EASY", duration: 2 },
      ]),
    totalVolumeEstimate: 24,
  },
  {
    name: "Ritmo Misto por Distância",
    level: "intermediate",
    unit: "KM",
    segments: Array(5)
      .fill(null)
      .flatMap(() => [
        { effort: "HARD", distance: 600 },
        { effort: "MODERATE", distance: 200 },
        { effort: "EASY", distance: 400 },
      ]),
    totalVolumeEstimate: 6,
  },

  // 💪 ADVANCED - Treinos intensos e variados
  {
    name: "Fartlek por distância",
    level: "advanced",
    unit: "KM",
    segments: Array(6)
      .fill(null)
      .flatMap(() => [
        { effort: "VERY_HARD", distance: 400 },
        { effort: "EASY", distance: 200 },
      ]),
    totalVolumeEstimate: 3.6,
  },
  {
    name: "Velocidade Progressiva",
    level: "advanced",
    unit: "MINUTES",
    segments: [
      { effort: "MODERATE", duration: 2 },
      { effort: "EASY", duration: 1 },
      { effort: "HARD", duration: 2 },
      { effort: "EASY", duration: 1 },
      { effort: "VERY_HARD", duration: 1 },
      { effort: "EASY", duration: 1.5 },
      { effort: "VERY_HARD", duration: 1.5 },
      { effort: "EASY", duration: 1 },
      { effort: "HARD", duration: 2 },
      { effort: "EASY", duration: 2 },
    ],
    totalVolumeEstimate: 15,
  },
  {
    name: "Picos de Potência",
    level: "advanced",
    unit: "KM",
    segments: Array(8)
      .fill(null)
      .flatMap(() => [
        { effort: "VERY_HARD", distance: 200 },
        { effort: "MODERATE", distance: 300 },
        { effort: "HARD", distance: 500 },
        { effort: "EASY", distance: 400 },
      ]),
    totalVolumeEstimate: 11.2,
  },
  {
    name: "Fartlek Composto",
    level: "advanced",
    unit: "MINUTES",
    segments: [
      // Bloco 1: Build-up
      { effort: "MODERATE", duration: 2 },
      { effort: "HARD", duration: 1 },
      { effort: "VERY_HARD", duration: 0.5 },
      { effort: "EASY", duration: 2 },
      // Bloco 2: Sustentação
      { effort: "HARD", duration: 4 },
      { effort: "EASY", duration: 2 },
      // Bloco 3: Explosões
      { effort: "VERY_HARD", duration: 1 },
      { effort: "EASY", duration: 1 },
      { effort: "VERY_HARD", duration: 1 },
      { effort: "EASY", duration: 1 },
      { effort: "VERY_HARD", duration: 1 },
      { effort: "MODERATE", duration: 2 },
    ],
    totalVolumeEstimate: 18.5,
  },
];

export const THRESHOLD_PATTERNS: ThresholdTemplate[] = [
  // == Continuous ==
  {
    name: "20min a 90% VAM",
    level: "beginner",
    vamIntensity: 0.9,
    reps: 1,
    workDurationMin: 20,
    restDurationFactor: 0,
    restDurationSeconds: 0,
    repsDistanceKm: 0,
    unit: "MINUTES",
    type: "CONTINUOUS",
    targetZones: [3],
  },
  {
    name: "25min a 90% VAM",
    level: "intermediate",
    vamIntensity: 0.9,
    reps: 1,
    workDurationMin: 25,
    restDurationFactor: 0,
    repsDistanceKm: 0,
    restType: "active",
    unit: "MINUTES",
    targetZones: [3, 4],
    type: "CONTINUOUS",
  },
  {
    name: "30min a 90% VAM",
    level: "advanced",
    vamIntensity: 0.9,
    reps: 1,
    workDurationMin: 30,
    restDurationFactor: 0,
    repsDistanceKm: 0,
    restType: "active",
    unit: "MINUTES",
    targetZones: [3, 4],
    type: "CONTINUOUS",
  },
  // == Intervalado ==
  {
    name: "3x8min a 90% VAM",
    level: "beginner",
    vamIntensity: 0.9,
    reps: 3,
    workDurationMin: 8,
    restDurationFactor: 0.25, // 2min
    repsDistanceKm: 0,
    restType: "active",
    unit: "MINUTES",
    targetZones: [3, 4],
    type: "INTERVALS",
  },
  {
    name: "3x10min a 90% VAM",
    level: "intermediate",
    vamIntensity: 0.9,
    reps: 3,
    workDurationMin: 10,
    restDurationFactor: 0.2, // 2min
    repsDistanceKm: 0,
    restType: "active",
    unit: "MINUTES",
    targetZones: [3, 4],
    type: "INTERVALS",
  },
  {
    name: "4x10min a 90% VAM",
    level: "advanced",
    vamIntensity: 0.9,
    reps: 4,
    workDurationMin: 10,
    restDurationFactor: 0.2, // 2min
    repsDistanceKm: 0,
    restType: "active",
    unit: "MINUTES",
    targetZones: [3, 4],
    type: "INTERVALS",
  },
];
