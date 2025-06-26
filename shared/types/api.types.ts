import type { ApiRoutes } from "../../server";

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

export type Test = {
  id: string;
  userId: string;
  testType: "3K" | "5K" | "6K" | "10K" | "21K";
  distanceM: number;
  durationS: number;
  paceMinKm: number | null;
  testDate: string;
};
