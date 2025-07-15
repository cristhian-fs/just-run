import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

export const getUserPlanning = async () => {
  const res = await client.trainings["planning"].$get();

  if (res.ok) {
    const data = await res.json();
    return data.data;
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};
