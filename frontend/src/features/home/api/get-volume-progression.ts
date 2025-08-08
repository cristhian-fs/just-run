import type { InferResponseType } from "hono";
import { client } from "@/lib/api";
import type { ErrorResponse } from "@/shared/types";

type Period = "7 days" | "14 days" | "30 days";

type ResponseType = InferResponseType<
	(typeof client.analytics)["volume-progression"]["$get"]
>;

export const getVolumeProgression = async ({
	period,
}: {
	period: Period;
}): Promise<ResponseType["data"]> => {
	const res = await client.analytics["volume-progression"].$get({
		query: {
			period,
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
