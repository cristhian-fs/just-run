import type { ApiRoutes } from "../../server";
import type { TIntensityZone } from "./training.types";

export { type ApiRoutes };

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

export interface WeeklyVolumeData {
  weekGoalM: number;
  currentWeekVolume: number;
  lastWeekVolume: number;
  weekProgress: number;
  progressOverWeek: number;
}

export interface MonthSummary {
  totalDistance: number;
  goalDistance: number;
  totalRuns: number;
  totalTimeMinutes: number;
  avgPaceS: number;
}

export interface VolumeProgression {
  date: string;
  volume: number | null;
  minutes: number | null;
}

export interface WeeklyIntensityZoneVolume {
  zone: TIntensityZone;
  volume: number;
}
