/** biome-ignore-all lint/complexity/noStaticOnlyClass: keep WorkoutService */
import { workouts as workoutsTable } from "@/db/schemas";
import { formatDate } from "@/lib/utils";
import type { Workout } from "@/shared/types";

import type { DbTransaction } from "../training-weeks/training-week.service";

export class WorkoutService {
	static async createWorkout(
		workout: Workout,
		trainingWeekId: string,
		tx: DbTransaction,
	) {
		// biome-ignore lint/correctness/noUnusedVariables: will be used only restWorkout
		const { blocks, segments, ...restWorkout } = workout;

		const [insertedWorkout] = await tx
			.insert(workoutsTable)
			.values({
				...restWorkout,
				trainingWeekId,
				createdAt: new Date(),
				scheduledStart: formatDate(new Date(workout.scheduledStart)),
			})
			.returning({ id: workoutsTable.id });

		if (!insertedWorkout) throw new Error("Falha ao criar treino");

		return insertedWorkout;
	}

	static async createWorkouts(
		workouts: Workout[],
		trainingWeekId: string,
		tx: DbTransaction,
	) {
		const createdWorkouts = [];

		for (const workout of workouts) {
			const insertedWorkout = await WorkoutService.createWorkout(
				workout,
				trainingWeekId,
				tx,
			);
			createdWorkouts.push({ ...insertedWorkout, originalWorkout: workout });
		}

		return createdWorkouts;
	}
}
