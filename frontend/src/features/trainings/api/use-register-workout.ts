import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type ResponseType = InferResponseType<
  (typeof client.trainings)[":userId"]["register-workout"][":workoutId"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.trainings)[":userId"]["register-workout"][":workoutId"]["$post"]
>;

export const useRegisterWorkout = ({ workoutId }: { workoutId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, form }) => {
      const response = await client.trainings[":userId"]["register-workout"][
        ":workoutId"
      ].$post({
        param: {
          userId: param.userId,
          workoutId: param.workoutId,
        },
        form,
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
      toast.success("Treino registrado com successo!");
      queryClient.invalidateQueries({
        queryKey: ["workout", workoutId],
      });
    },
    onError: () => {
      toast.error("Erro ao registrar treino!");
    },
  });

  return mutation;
};
