import type { TrainingLevel } from "@/shared/types";
import type { ProgressiveBlock, ProgressiveWorkoutOptions } from "@/lib/types";
import { roundDecimals } from "@/lib/utils/numbers";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

function getBlockCount(level: TrainingLevel, volume: number): number {
  const thresholds = {
    beginner: [30, 50, 70],
    intermediate: [30, 50, 70, 90],
    advanced: [40, 70, 90, 110],
  };

  const maxBlocks = {
    beginner: 4,
    intermediate: 5,
    advanced: 6,
  };

  const levels = thresholds[level as keyof typeof thresholds];
  for (let i = 0; i < levels.length; i++) {
    if (volume <= levels[i]!) return i + 2;
  }

  return maxBlocks[level as keyof typeof maxBlocks];
}

export function generateProgressiveWorkout({
  level,
  vam,
  volume,
  unit,
  includeWarmUp = true,
}: ProgressiveWorkoutOptions): ProgressiveBlock[] {
  const totalVolume = volume;
  const numBlocks = getBlockCount(level, totalVolume);

  const warmupShare = includeWarmUp ? 0.1 : 0;
  const cooldownShare = includeWarmUp ? 0.1 : 0;
  const mainShare = 1 - warmupShare - cooldownShare;

  const mainVolume = totalVolume * mainShare;

  const baseIntensity = {
    beginner: 0.7,
    intermediate: 0.75,
    advanced: 0.78,
  }[level];

  const incrementPerBlock = 0.05;

  const blocks: ProgressiveBlock[] = [];

  // Warm up
  if (includeWarmUp) {
    const wamKmh = vam * 0.65;
    blocks.push({
      block: 0,
      vamIntensity: 0.65,
      pace: formatPace(getPace(wamKmh)),
      ...(unit === "MINUTES"
        ? { durationMin: roundDecimals(totalVolume * warmupShare, 1) }
        : { distanceKm: roundDecimals(totalVolume * warmupShare, 2) }),
      type: "warmup",
    });
  }

  // Main progressive blocks
  const perBlockVolume = mainVolume / numBlocks;
  for (let i = 0; i < numBlocks; i++) {
    const vamIntensity = roundDecimals(
      baseIntensity + i * incrementPerBlock,
      2,
    );
    const kmh = vam * vamIntensity;

    blocks.push({
      block: i + 1,
      vamIntensity,
      pace: formatPace(getPace(kmh)),
      ...(unit === "MINUTES"
        ? { durationMin: roundDecimals(perBlockVolume, 1) }
        : { distanceKm: roundDecimals(perBlockVolume, 2) }),
      type: "main",
    });
  }

  // Cooldown
  if (includeWarmUp) {
    const coolKmh = vam * 0.6;
    blocks.push({
      block: numBlocks + 1,
      vamIntensity: 0.6,
      pace: formatPace(getPace(coolKmh)),
      ...(unit === "MINUTES"
        ? { durationMin: roundDecimals(totalVolume * cooldownShare, 1) }
        : { distanceKm: roundDecimals(totalVolume * cooldownShare, 2) }),
      type: "cooldown",
    });
  }

  return blocks;
}
