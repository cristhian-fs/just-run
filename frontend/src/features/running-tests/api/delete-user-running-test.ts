import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type ResponseType = InferResponseType<
  (typeof client)["running-tests"][":id"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client)["running-tests"][":id"]["$delete"]
>;

export const deleteUserRunningTest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client["running-tests"][":id"].$delete({
        param,
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
      toast.success("Teste excluido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: () => {
      toast.error("Erro ao excluir teste!");
    },
  });

  return mutation;
};
