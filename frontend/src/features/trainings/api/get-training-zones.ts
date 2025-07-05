import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

export const getTrainingZones = async (userId: string) => {
  const res = await client.trainings[":userId"]["training-zones"].$get({
    param: {
      userId,
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};
