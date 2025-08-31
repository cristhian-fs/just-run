import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

export const getPlan = async (id: string) => {
	const res = await client.plans[":planId"].$get({
		param: {
			planId: id,
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
