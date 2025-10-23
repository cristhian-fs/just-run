import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

type ResponseType = InferResponseType<
	(typeof client.users)["add-test"]["$post"],
	200
>;
type RequestType = InferRequestType<(typeof client.users)["add-test"]["$post"]>;

export const useAddTest = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form }) => {
			const response = await client.users["add-test"].$post({
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
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Erro ao adicionar teste!");
		},
	});

	return mutation;
};
