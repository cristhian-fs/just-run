import { workouts as workoutsTable } from "@/db/schemas";

import type { Workout } from "@/shared/types";
import { formatDate } from "@/lib/utils";

import type { DbTransaction } from "../training-weeks/training-week.service";

export class WorkoutService {
  static async createWorkout(
    workout: Workout,
    trainingWeekId: string,
    tx: DbTransaction,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const insertedWorkout = await this.createWorkout(
        workout,
        trainingWeekId,
        tx,
      );
      createdWorkouts.push({ ...insertedWorkout, originalWorkout: workout });
    }

    return createdWorkouts;
  }
}
