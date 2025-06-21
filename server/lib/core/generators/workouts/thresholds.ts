import type { TrainingLevel } from "@/shared/types";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

export function generateThresholdWorkout({
  level,
  vo2Max,
  volume, // total do treino em minutos ou km
  unit = "MINUTES",
}: {
  level: TrainingLevel;
  vo2Max: number;
  volume: number;
  unit?: "MINUTES" | "KM";
}) {
  const vam = vo2Max; // já vem convertido, ex: 16 km/h
  const thresholdIntensity = 0.9;
  const thresholdVelocity = vam * thresholdIntensity; // km/h
  const thresholdPace = getPace(thresholdVelocity); // min/km
  const formattedPace = formatPace(thresholdPace);

  // Volume dividido
  const warmUpPart = 0.1;
  const cooldownPart = 0.1;
  const mainPart = 0.8;

  let warmUp: number;
  let cooldown: number;
  let thresholdWork: number;

  if (unit === "MINUTES") {
    warmUp = volume * warmUpPart;
    cooldown = volume * cooldownPart;
    thresholdWork = volume * mainPart;

    const isInterval = thresholdWork >= 25;
    const workBlock = isInterval ? 10 : thresholdWork;
    const reps = isInterval ? Math.floor(thresholdWork / workBlock) : 1;
    const rest = isInterval ? 2 : 0;

    return {
      name: isInterval
        ? `${reps}x${workBlock}min @ 90% VAM`
        : `${Math.round(thresholdWork)}min contínuo @ 90% VAM`,
      type: isInterval ? "INTERVALS" : "CONTINUOUS",
      unit: "MINUTES",
      level,
      reps,
      workDurationMin: Math.round(workBlock),
      totalWorkMin: Math.round(thresholdWork),
      restDurationSeconds: rest * 60,
      restType: isInterval ? "active" : undefined,
      targetZones: [3],
      wam: Number(warmUp.toFixed(1)),
      cooldown: Number(cooldown.toFixed(1)),
      pace: formattedPace,
    };
  }

  if (unit === "KM") {
    warmUp = volume * warmUpPart;
    cooldown = volume * cooldownPart;
    thresholdWork = volume * mainPart;

    const isInterval = thresholdWork >= 6;
    const blockKm = isInterval ? 2 : thresholdWork;
    const reps = isInterval ? Math.floor(thresholdWork / blockKm) : 1;
    const durationPerRep = (blockKm / thresholdVelocity) * 60; // min
    const rest = isInterval ? 2 : 0;

    return {
      name: isInterval
        ? `${reps}x${blockKm}km @ 90% VAM`
        : `${thresholdWork.toFixed(1)}km contínuo @ 90% VAM`,
      type: isInterval ? "INTERVALS" : "CONTINUOUS",
      unit: "KM",
      level,
      reps,
      repsDistanceKm: blockKm,
      workDurationMin: Number(durationPerRep.toFixed(1)),
      totalWorkKm: +thresholdWork.toFixed(1),
      restDurationSeconds: rest * 60,
      restType: isInterval ? "active" : undefined,
      targetZones: [3],
      warmUpDistanceKm: Number(warmUp.toFixed(1)),
      cooldownDistanceKm: Number(cooldown.toFixed(1)),
      pace: formattedPace,
    };
  }

  throw new Error("Unidade inválida");
}
