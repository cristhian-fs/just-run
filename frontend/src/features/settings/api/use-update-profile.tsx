import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

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
			queryClient.invalidateQueries({ queryKey: ["user", "test"] });
		},
	});

	return mutation;
};
