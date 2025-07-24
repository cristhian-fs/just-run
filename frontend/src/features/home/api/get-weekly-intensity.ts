import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

export const getWeeklyIntensity = async () => {
  const res = await client.analytics["weekly-intensity-volume"].$get();
  const data = await res.json();
  if (res.ok && data.success) {
    return data.data;
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};
