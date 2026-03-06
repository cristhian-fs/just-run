import { client } from "@/lib/api";
import type { ErrorResponse, WorkoutAnalytics } from "@/shared/types";

export const getUserPlanAnalytics = async () => {
  const res = await client.analytics['plan-analytics'].$get();

  if (res.ok) {
    const data = await res.json();
    return data.data as WorkoutAnalytics[];
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};
