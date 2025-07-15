import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type ResponseType = InferResponseType<
  (typeof client.users)["update-profile"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.users)["update-profile"]["$post"]
>;

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.users["update-profile"].$post({
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
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["user", "test"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário!");
    },
  });

  return mutation;
};
