import type { TrainingZone } from "@/lib/types";
import type {
  MonthVolume,
  PeriodizationType,
} from "@/lib/types/periodization.types";

export function generateVolumeProfile(type: PeriodizationType): MonthVolume[] {
  const base = {
    LINEAR: [100, 95, 95, 90, 90, 85],
    REVERSE: [90, 95, 100, 100, 95, 85],
  };

  return base[type].map((volume, index) => ({
    monthIndex: index,
    monthVolumePercentage: volume,
  }));
}

export function getTrainingZone(
  zones: TrainingZone[],
  percentage: number,
): TrainingZone | undefined {
  return zones.find((zone) => zone.vo2Percentage === percentage);
}

export function getTargetZone(vamIntensity: number): number {
  if (vamIntensity < 0.75) return 1;
  if (vamIntensity < 0.85) return 2;
  if (vamIntensity < 0.94) return 3;
  if (vamIntensity < 1.04) return 4;
  return 5;
}
