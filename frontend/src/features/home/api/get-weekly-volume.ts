import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

export const getWeeklyVolume = async () => {
	const res = await client.analytics["weekly-volume"].$get();
	const data = await res.json();
	if (res.ok && data.success) {
		return data.data;
	} else {
		const data = (await res.json()) as unknown as ErrorResponse;
		throw new Error(data.error);
	}
};
