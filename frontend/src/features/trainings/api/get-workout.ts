import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

export const getWorkout = async ({
  userId,
  workoutId,
}: {
  userId: string;
  workoutId: string;
}) => {
  const res = await client.trainings[":userId"]["workout"][":workoutId"].$get({
    param: {
      userId,
      workoutId,
    },
  });
  const data = await res.json();
  if (res.ok && data.success) {
    return data.data;
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};
