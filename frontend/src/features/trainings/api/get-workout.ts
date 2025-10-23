import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

export const getWorkout = async ({ workoutId }: { workoutId: string }) => {
	const res = await client.trainings["workout"][":workoutId"].$get({
		param: {
			workoutId,
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
