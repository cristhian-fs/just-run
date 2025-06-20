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
