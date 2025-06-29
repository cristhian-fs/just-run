import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  goal,
  tests,
  trainingWeeks,
  user,
  workouts as workoutsTable,
} from "@/db/schemas";
import { block as blockTable, segmentsTable } from "@/db/schemas/workouts";
import { loggedIn } from "@/middlewares/logged-in";

import type { TrainingGoal } from "@/shared/types";
import { goalToRacePlan } from "@/lib/config/training-goals";
import type { Context } from "@/lib/context";
import { getStartDate } from "@/lib/core/calculations/time";
import { distributeWeeklyVolumesWithDays } from "@/lib/core/generators/dayly-distribution";
import { formatDate } from "@/lib/utils";

export const trainingRouter = new Hono<Context>().post(
  "/:userId/generate",
  loggedIn,
  async (c) => {
    const { userId } = c.req.param();

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userData) {
      return c.json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const lastUserTest = await db.query.tests.findFirst({
      where: eq(tests.userId, userId),
      orderBy: (tests, { desc }) => desc(tests.testDate),
    });
    const lastUserGoal = await db.query.goal.findFirst({
      where: eq(goal.userId, userId),
      orderBy: (goal, { desc }) => desc(goal.createdAt),
    });

    if (!lastUserTest || !lastUserGoal) {
      return c.json({
        success: false,
        message: "Nenhum teste foi feito pelo usuário",
      });
    }

    const goalData = goalToRacePlan[lastUserGoal.goalType as TrainingGoal];

    if (goalData) {
      const { race, weeklyKm } = goalData;

      const trainings = distributeWeeklyVolumesWithDays(
        8,
        race,
        weeklyKm,
        lastUserGoal.weeklyFrequency,
        userData.trainingLevel === "beginner" ? "KM" : "MINUTES",
        getStartDate(),
        userData.trainingLevel!,
        lastUserTest.vam!,
        lastUserTest,
      );
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

      return c.json({
        success: true,
        message: "Periodização gerada com sucesso!",
      });
    }
  },
);
