import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

export const useGeneratePeriodization = () => {

  const query = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.trainings["generate"].$post();

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const data = (await response.json()) as unknown as ErrorResponse;
        throw new Error(data.error);
      }
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  return mutation;
};
