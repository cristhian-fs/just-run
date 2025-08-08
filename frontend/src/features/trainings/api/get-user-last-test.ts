import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

export const getUserLastTest = async ({ userId }: { userId: string }) => {
	const res = await client.trainings["last-running-test"].$get({
		param: {
			userId,
		},
	});
	const data = await res.json();
	if (res.ok && data.success) {
		return data.data;
	} else {
		const data = (await res.json()) as unknown as ErrorResponse;
		throw new Error(data.error);
	}
};
