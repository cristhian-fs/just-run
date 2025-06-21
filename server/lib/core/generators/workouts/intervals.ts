import type { TrainingLevel } from "@/shared/types";
import { INTERVAL_PATTERNS } from "@/lib/config/workouts.contants";
import type { IntervalTemplate, TrainingUnit } from "@/lib/types";
import { roundDecimals } from "@/lib/utils/numbers";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

function isValidInterval({
  unit,
  reps,
  repDistanceKm,
  intensityKm,
}: {
  unit: TrainingUnit;
  reps: number;
  repDistanceKm?: number;
  intensityKm: number;
}) {
  if (unit === "KM") {
    if (!repDistanceKm) return false;
    if (reps < 3 || reps > 20) return false;
    if (intensityKm / repDistanceKm > 20) return false;
  }

  if (unit === "MINUTES") {
    if (reps < 3 || reps > 12) return false;
  }

  return true;
}

export function generateIntervalWorkout({
  level = "intermediate",
  targetKm,
  intensityKm,
  vam = 14, // Velocidade aeróbica máxima em km/h
}: {
  level: TrainingLevel;
  targetKm: number;
  intensityKm: number;
  vam?: number;
}): IntervalTemplate | undefined {
  const lowVolume = targetKm - intensityKm;

  const warmUpVolume = lowVolume * 0.4;
  const cooldownVolume = lowVolume * 0.4;

  const unit: TrainingUnit = level === "beginner" ? "MINUTES" : "KM";

  const availablePatterns = INTERVAL_PATTERNS.filter(
    (p) => p.level === level && p.unit === unit,
  );

  const generatedOptions: IntervalTemplate[] = [];

  for (const pattern of availablePatterns) {
    const velocity = pattern.vamIntensity * vam; // em km/h

    if (unit === "KM") {
      const repDistanceKm = pattern.repsDistanceKm;
      if (!repDistanceKm) continue;

      const numReps = Math.round(intensityKm / repDistanceKm);
      if (
        !isValidInterval({
          unit,
          reps: numReps,
          repDistanceKm,
          intensityKm,
        })
      )
        continue;

      const actualKm = numReps * repDistanceKm;
      const workDurationMin = (repDistanceKm / velocity) * 60;
      const restDurationMin =
        workDurationMin * (pattern.restDurationFactor ?? 1);

      const pace = getPace(velocity); // <- passa a velocidade correta
      const formattedPace = formatPace(pace);

      generatedOptions.push({
        name: `${numReps}x${Math.round(repDistanceKm * 1000)}m a ${Math.round(
          pattern.vamIntensity * 100,
        )}% VAM`,
        level,
        unit,
        vamIntensity: pattern.vamIntensity,
        reps: numReps,
        repsDistanceKm: repDistanceKm,
        workDurationMin: Number(workDurationMin.toFixed(2)),
        restDurationSeconds: Math.floor(restDurationMin * 60),
        restType: pattern.restType,
        totalEstimatedDistanceKm: Math.floor(
          actualKm + warmUpVolume + cooldownVolume,
        ),
        targetZones: pattern.targetZones ?? [4],
        warmUpDistanceKm: roundDecimals(warmUpVolume, 1),
        cooldownDistanceKm: roundDecimals(cooldownVolume, 1),
        repsPace: formattedPace,
      });
    }

    if (unit === "MINUTES") {
      const workDurationMin = pattern.workDurationMin ?? 1;
      const numReps = pattern.reps;
      const totalWorkMin = workDurationMin * numReps;
      const intensityDistanceKm = (totalWorkMin * velocity) / 60;

      if (
        !isValidInterval({
          unit,
          reps: numReps,
          intensityKm,
        })
      )
        continue;

      const restDurationMin =
        workDurationMin * (pattern.restDurationFactor ?? 1);

      const totalEstimatedDistanceKm =
        intensityDistanceKm + warmUpVolume + cooldownVolume;
      const pace = getPace(velocity);
      const formattedPace = formatPace(pace);

      generatedOptions.push({
        name: `${numReps}x${workDurationMin}min a ${Math.round(
          pattern.vamIntensity * 100,
        )}% VAM`,
        level,
        unit,
        vamIntensity: pattern.vamIntensity,
        reps: numReps,
        repsDistanceKm: Number((intensityDistanceKm / numReps).toFixed(2)),
        workDurationMin,
        restDurationSeconds: Math.floor(restDurationMin * 60),
        restType: pattern.restType,
        repsPace: formattedPace,
        totalEstimatedDistanceKm,
        targetZones: pattern.targetZones ?? [3],
        warmUpDurationMin: roundDecimals(
          +((warmUpVolume / velocity) * 60).toFixed(2),
          1,
        ),
        cooldownDurationMin: roundDecimals(
          +((cooldownVolume / velocity) * 60),
          1,
        ),
      });
    }
  }

  if (generatedOptions.length === 0) {
    throw new Error("Nenhum template válido encontrado para os parâmetros.");
  }

  const randomIndex = Math.floor(Math.random() * generatedOptions.length);
  return generatedOptions.sort(
    (a, b) =>
      Math.abs(a.totalEstimatedDistanceKm! - targetKm) -
      Math.abs(b.totalEstimatedDistanceKm! - targetKm),
  )[randomIndex];
}
