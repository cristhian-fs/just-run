import { InferRequestType, InferResponseType } from "hono";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { ErrorResponse } from "@/shared/types";
import { client } from "@/lib/api";

type ResponseType = InferResponseType<
  (typeof client.trainings)[":userId"]["generate"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.trainings)[":userId"]["generate"]["$post"]
>;

export const useGeneratePeriodization = () => {
  const navigate = useNavigate();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.trainings[":userId"]["generate"].$post({
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
      toast.success("Periodização gerada com sucesso!");
      navigate({ to: "/" });
    },
  });

  return mutation;
};
