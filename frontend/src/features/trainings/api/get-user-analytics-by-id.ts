import { client } from "@/lib/api";
import type { ErrorResponse, TrainingPlan, WorkoutAnalytics } from "@/shared/types";

type UserAnalyticsByIdResponse = WorkoutAnalytics & {
  plan: TrainingPlan
}

export const getUserAnalyticsById = async (id: string) => {
  const res = await client.analytics["plan-analytics"][':id'].$get({
    param: {
      id
    }
  });

  if (res.ok) {
    const data = await res.json();
    return data.data as UserAnalyticsByIdResponse;
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};
