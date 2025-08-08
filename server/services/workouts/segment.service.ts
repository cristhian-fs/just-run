/** biome-ignore-all lint/complexity/noStaticOnlyClass: keep WorkoutService */
import { segmentsTable } from "@/db/schemas";

import type { Segment } from "@/shared/types";

import type { DbTransaction } from "../training-weeks/training-week.service";

export class SegmentService {
	static async createSegment(
		segment: Segment,
		parentId: string,
		parentType: "block" | "workout",
		tx: DbTransaction,
	) {
		const values =
			parentType === "block"
				? { ...segment, blockId: parentId }
				: { ...segment, workoutId: parentId };

		const [insertedSegment] = await tx
			.insert(segmentsTable)
			.values(values)
			.returning({ id: segmentsTable.id });

		if (!insertedSegment) {
			throw new Error("Falha ao criar segment");
		}

		return insertedSegment;
	}

	static async createSegments(
		segments: Segment[],
		parentId: string,
		parentType: "block" | "workout",
		tx: DbTransaction,
	) {
		const createdSegments = [];

		for (const segment of segments) {
			const insertedSegment = await SegmentService.createSegment(
				segment,
				parentId,
				parentType,
				tx,
			);
			createdSegments.push(insertedSegment);
		}

		return createdSegments;
	}
}
