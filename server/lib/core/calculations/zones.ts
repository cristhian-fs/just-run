import type { TTrainingType } from "@/shared/types";
import { raceDistances } from "@/lib/config/workouts.contants";
import type { RaceTarget, TrainingZone } from "@/lib/types/training.types";

import { formatPace } from "./time";

export function getZoneVO2(vo2max: number, percentage: number): number {
  return +((vo2max - 3.5) * percentage + 3.5).toFixed(2);
}

export function getCardioFrequency(fcmax: number, percentage: number): number {
  return Math.floor(fcmax * percentage);
}

export function getVelocity(vo2: number): number {
  return +((vo2 - 3.5) / 3.33).toFixed(2);
}

export function getPace(velocity: number): number {
  if (velocity === 0) return 0;
  return 60 / velocity; // minutos por km
}

export function calculateTrainingZones(
  fcmax: number,
  vo2max: number,
): TrainingZone[] {
  const zones = [
    {
      name: "Z1",
      vo2Percentage: 0.65,
      workouts: ["RECOVERY_RUN", "EASY_RUN"] as TTrainingType[],
    },
    {
      name: "Z1",
      vo2Percentage: 0.7,
      workouts: ["EASY_RUN"] as TTrainingType[],
    },
    {
      name: "Z2",
      vo2Percentage: 0.75,
      workouts: ["EASY_RUN", "LONG_RUN"] as TTrainingType[],
    },
    {
      name: "Z2",
      vo2Percentage: 0.8,
      workouts: ["LONG_RUN", "PROGRESSIVE_RUN"] as TTrainingType[],
    },
    {
      name: "Z3",
      vo2Percentage: 0.85,
      workouts: ["THRESHOLD_RUN", "PROGRESSIVE_RUN"] as TTrainingType[],
    },
    {
      name: "Z3",
      vo2Percentage: 0.9,
      workouts: ["THRESHOLD_RUN", "FARTLEK"] as TTrainingType[],
    },
    {
      name: "Z4",
      vo2Percentage: 0.95,
      workouts: ["INTERVAL", "FARTLEK"] as TTrainingType[],
    },
    {
      name: "Z4",
      vo2Percentage: 1,
      workouts: ["INTERVAL", "REPETITION"] as TTrainingType[],
    },
    {
      name: "Z5",
      vo2Percentage: 1.05,
      workouts: ["REPETITION", "FARTLEK"] as TTrainingType[],
    },
    {
      name: "Z5",
      vo2Percentage: 1.1,
      workouts: ["REPETITION"] as TTrainingType[],
    },
  ];

  return zones.map((zone) => {
    const vo2 = getZoneVO2(vo2max, zone.vo2Percentage);
    const velocity = getVelocity(vo2);
    const pace = getPace(velocity);
    const formattedPace = formatPace(pace);
    return {
      ...zone,
      vo2Max: vo2,
      velocity,
      pace: formattedPace,
      cardioFrequency: getCardioFrequency(fcmax, zone.vo2Percentage),
    };
  });
}

export function estimateVelocitiesFromTest({
  distanceM,
  durationS,
  decayK = 0.06, // 6% de queda de velocidade a cada dobra de distância
  vam,
}: {
  distanceM: number; // teste: metros
  durationS: number; // teste: segundos
  vam?: number; // velocidade em km/h (opcional)
  decayK?: number; // coeficiente de fadiga (0.06 a 0.08 p/ amadores)
}): Record<RaceTarget, number> {
  const v0 =
    vam ??
    distanceM /
      1000 / // ➜ km
      (durationS / 3600); // ➜ horas → km/h

  const d0 = distanceM; // manter em mesma unidade (metros)

  const result = {} as Record<RaceTarget, number>;

  for (const [key, d] of Object.entries(raceDistances)) {
    const paceRatio = Math.pow(d / d0, decayK); // fator (>1 p/ dist. maiores)
    result[key as RaceTarget] = v0 / paceRatio; // nova velocidade km/h
  }

  return result;
}
