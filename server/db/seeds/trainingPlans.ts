import {
	planBlocks,
	planSegments,
	plans,
	planWeeks,
	planWorkouts,
} from "@/db/schemas/plans";
import type { TSegmentKind, TTrainingType } from "@/shared/types";
import { db } from "..";
import { allPlans } from "./data";

export default async function seedPlan() {
	Object.values(allPlans).forEach(async (trainingPlan) => {
		const plan = await db
			.insert(plans)
			.values({
				name: trainingPlan.name,
				level: trainingPlan.level as
					| "beginner"
					| "intermediate"
					| "advanced"
					| "elite",
				description: trainingPlan.description,
				coach: trainingPlan.coach,
				weeklyVolume: trainingPlan.weekly_volume,
				totalWeeks: trainingPlan.totalWeeks,
				distances: trainingPlan.distances,
				createdAt: new Date(),
			})
			.returning({ id: plans.id });

		if (!plan || !plan[0]) throw new Error("Failed to create plan");

		for (const week of trainingPlan.weeks) {
			const insertedWeek = await db
				.insert(planWeeks)
				.values({
					planId: plan[0].id,
					weekNumber: week.weekNumber,
					totalVolumeMin: week.totalVolumeMin,
				})
				.returning();

			if (!insertedWeek || !insertedWeek[0])
				throw new Error("Failed to create week");

			for (const workout of week.workouts) {
				const [insertedWorkout] = await db
					.insert(planWorkouts)
					.values({
						planWeekId: insertedWeek[0].id,
						runType: workout.runType as TTrainingType,
						plannedDistanceM: workout.plannedDistanceM
							? workout.plannedDistanceM
							: 0,
						plannedDurationS: workout.plannedDurationS
							? workout.plannedDurationS
							: 0,
						title: workout.title,
						notes: workout.notes ? workout.notes : null,
						dayIndex: workout.dayIndex,
					})
					.returning();

				if (!insertedWorkout) throw new Error("Failed to create workout");

				for (let i = 0; i < workout.blocks.length; i++) {
					const block = workout.blocks[i];
					if (!block) continue;
					const insertedBlock = await db
						.insert(planBlocks)
						.values({
							blockKind: block.blockKind as TSegmentKind,
							repeatCount: block.repeatCount,
							orderIndex: block.orderIndex,
							description: block.description,
							workoutId: insertedWorkout.id,
						})
						.returning();

					if (!insertedBlock || !insertedBlock[0])
						throw new Error("Failed to create block");

					for (let j = 0; j < block.segments.length; j++) {
						const segment = block.segments[j];
						if (!segment) continue;
						await db.insert(planSegments).values({
							orderInBlock: segment.orderInBlock || j,
							segmentKind: segment.segmentKind as TSegmentKind,
							plannedDistanceM: segment.plannedDistanceM
								? segment.plannedDistanceM
								: 0,
							plannedDurationS: segment.plannedDurationS
								? segment.plannedDurationS
								: 0,
							blockId: insertedBlock[0].id,
						});
					}
				}
			}
		}
	});
}
