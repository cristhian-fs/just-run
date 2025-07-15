import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

export const getUserLastTest = async ({ userId }: { userId: string }) => {
  const res = await client.trainings[":userId"]["last-running-test"].$get({
    param: {
      userId,
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
