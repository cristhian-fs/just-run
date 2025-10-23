import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

export const getMonthlySummary = async () => {
	const res = await client.analytics["monthly-summary"].$get();
	const data = await res.json();
	if (res.ok && data.success) {
		return data.data;
	} else {
		const data = (await res.json()) as unknown as ErrorResponse;
		throw new Error(data.error);
	}
};
