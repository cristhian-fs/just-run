import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  blocks as blockTable,
  segmentsTable,
  trainingWeeks,
  workouts as workoutsTable,
} from "@/db/schemas";

import type { Training, Workout } from "@/shared/types";
import type { WeeklyKmTrainingDistribution } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export async function saveTrainingsWeekWithWorkouts({
  trainings,
  userId,
}: {
  userId: string;
  trainings: {
    week: WeeklyKmTrainingDistribution;
    weekStart: Date;
    trainingDays: Training[];
    workouts: Workout[];
  }[];
}): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(trainingWeeks).where(eq(trainingWeeks.userId, userId));

    for (const week of trainings) {
      if (!week.workouts.length) continue;

      const { week: weekData } = week;

      const [insertedWeek] = await tx
        .insert(trainingWeeks)
        .values({
          totalVolumeMin: weekData.totalVolumeMin,
          userId,
          weekStart: formatDate(new Date(weekData.weekStart)),
          weekType: weekData.weekType,
          createdAt: new Date(),
        })
        .returning({ id: trainingWeeks.id });

      if (!insertedWeek) throw new Error("Falha ao criar week");

      for (const workout of week.workouts) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { blocks, segments, ...restWorkout } = workout;

        const [insertedWorkout] = await tx
          .insert(workoutsTable)
          .values({
            ...restWorkout,
            trainingWeekId: insertedWeek.id,
            createdAt: new Date(),
            scheduledStart: formatDate(new Date(workout.scheduledStart)),
          })
          .returning({ id: workoutsTable.id });

        if (!insertedWorkout) throw new Error("Falha ao criar workout");

        // blocos
        if (workout.blocks?.length) {
          for (const block of workout.blocks) {
            const [insertedBlock] = await tx
              .insert(blockTable)
              .values({ ...block, workoutId: insertedWorkout.id })
              .returning({ id: blockTable.id });

            if (!insertedBlock) throw new Error("Falha ao criar block");

            if (block.segments) {
              for (const segment of block.segments) {
                await tx.insert(segmentsTable).values({
                  ...segment,
                  blockId: insertedBlock.id,
                });
              }
            }
          }
        }

        // segmentos diretos
        if (workout.segments?.length) {
          for (const segment of workout.segments) {
            await tx.insert(segmentsTable).values({
              ...segment,
              workoutId: insertedWorkout.id,
            });
          }
        }
      }
    }
  });
}
