import type { TrainingZone } from "../types";

export function getTrainingZone(
  zones: TrainingZone[],
  percentage: number,
): TrainingZone | undefined {
  return zones.find((zone) => zone.vo2Percentage === percentage);
}
