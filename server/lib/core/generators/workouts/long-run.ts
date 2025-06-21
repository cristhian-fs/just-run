import type { LongRunBlock, LongRunWorkoutOptions } from "@/lib/types";
import { roundDecimals } from "@/lib/utils/numbers";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

export function generateLongRun({
  level,
  vam,
  volumeKm,
  includeProgression,
}: LongRunWorkoutOptions) {
  const easyIntensity = 0.65;
  const steadyIntensity = 0.7;
  const progressionIntensity = 0.8;

  let easyKm = volumeKm;

  const blocks: LongRunBlock[] = [];

  if (includeProgression && volumeKm >= 12) {
    const progressionKm =
      level === "advanced" ? 0.25 * volumeKm : 0.15 * volumeKm;
    easyKm = volumeKm - progressionKm;

    blocks.push({
      phase: "easy",
      vamIntensity: steadyIntensity,
      distanceKm: roundDecimals(easyKm, 1),
      pace: formatPace(getPace(vam * steadyIntensity)),
    });

    blocks.push({
      phase: "progression",
      vamIntensity: progressionIntensity,
      distanceKm: roundDecimals(progressionKm, 1),
      pace: formatPace(getPace(vam * progressionIntensity)),
    });
  } else {
    blocks.push({
      phase: "easy",
      vamIntensity: steadyIntensity,
      distanceKm: roundDecimals(easyKm, 1),
      pace: formatPace(getPace(vam * steadyIntensity)),
    });
  }

  return blocks;
}
