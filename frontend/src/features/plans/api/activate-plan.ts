import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

type ResponseType = InferResponseType<
	(typeof client.plans)["activate-plan"][":planId"]["$post"],
	200
>;
type RequestType = InferRequestType<
	(typeof client.plans)["activate-plan"][":planId"]["$post"]
>;

export const activatePlan = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.plans["activate-plan"][":planId"].$post({
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
			toast.success("Plano ativado com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["planning"] });
		},
		onError: (error) => {
			toast.error("Erro ao ativar plano!", {
				description: JSON.stringify(error.message),
			});
		},
	});

	return mutation;
};
