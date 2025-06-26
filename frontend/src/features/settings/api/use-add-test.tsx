import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type ResponseType = InferResponseType<
  (typeof client.users)[":id"]["add-test"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.users)[":id"]["add-test"]["$post"]
>;

export const useAddTest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.users[":id"]["add-test"].$post({
        form,
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
      toast.success("Teste adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["user", "test"] });
    },
    onError: () => {
      toast.error("Erro ao adicionar teste!");
    },
  });

  return mutation;
};
