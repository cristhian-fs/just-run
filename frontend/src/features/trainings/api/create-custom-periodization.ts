import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type ResponseType = InferResponseType<
  (typeof client.trainings)["new-periodization-plan"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.trainings)["new-periodization-plan"]["$post"]
>;

export const createCustomPeriodization = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.trainings["new-periodization-plan"].$post({
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
      toast.success("Periodização gerada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["planning"],
      });
    },
    onError: () => {
      toast.error("Erro ao criar periodização!");
    },
  });

  return mutation;
};
