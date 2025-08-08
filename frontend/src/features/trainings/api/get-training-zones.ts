import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

export const getTrainingZones = async () => {
	const res = await client.trainings["training-zones"].$get();

	if (res.ok) {
		const data = await res.json();
		return data;
	} else {
		const data = (await res.json()) as unknown as ErrorResponse;
		throw new Error(data.error);
	}
};
