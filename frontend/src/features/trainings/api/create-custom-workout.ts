import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type ResponseType = InferResponseType<
  (typeof client.trainings)["add-custom-workout"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.trainings)["add-custom-workout"]["$post"]
>;

export const createCustomWorkout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      await queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
      const response = await client.trainings["add-custom-workout"].$post({
        json,
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const data = (await response.json()) as unknown as ErrorResponse;
        throw new Error(data.error);
      }
    },
    onSuccess: () => {
      toast.success("Treino adicionado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar treino!");
    },
  });

  return mutation;
};
