import { InferResponseType } from "hono";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type Period = "7 days" | "14 days" | "30 days";

type ResponseType = InferResponseType<
  (typeof client.analytics)[":userId"]["volume-progression"]["$get"]
>;

export const getVolumeProgression = async ({
  userId,
  period,
}: {
  userId: string;
  period: Period;
}): Promise<ResponseType["data"]> => {
  const res = await client.analytics[":userId"]["volume-progression"].$get({
    param: {
      userId,
    },
    query: {
      period,
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
