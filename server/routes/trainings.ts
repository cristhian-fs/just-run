import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { and, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import {
  goal,
  tests,
  trainingWeeks,
  trainingZones as trainingZonesTable,
  user,
  workouts as workoutsTable,
} from "@/db/schemas";
import { blocks as blockTable, segmentsTable } from "@/db/schemas/workouts";
import { loggedIn } from "@/middlewares/logged-in";
import { format } from "date-fns";
import { previousMonday } from "date-fns/previousMonday";
import { startOfToday } from "date-fns/startOfToday";

import {
  type PlanningSelect,
  type SuccessResponse,
  type TrainingGoal,
  type TraningZoneSelect,
  type WorkoutSelect,
} from "@/shared/types";
import {
  defaultWeeklyMinutesByGoal,
  goalToRacePlan,
} from "@/lib/config/training-goals";
import type { Context } from "@/lib/context";
import { getStartDate } from "@/lib/core/calculations/time";
import { distributeWeeklyVolumesWithDays } from "@/lib/core/generators/dayly-distribution";
import { formatDate } from "@/lib/utils";

export const trainingRouter = new Hono<Context>()
  .post(
    "/:userId/generate",
    // loggedIn,
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
        orderBy: (tests, { desc }) => desc(tests.createdAt),
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
          await tx
            .delete(trainingWeeks)
            .where(eq(trainingWeeks.userId, userId));

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

        return c.json(
          {
            success: true,
            message: "Periodização gerada com sucesso!",
            data: trainings,
          },
          200,
        );
      } else {
        const goalMinutesData =
          defaultWeeklyMinutesByGoal[lastUserGoal.goalType as TrainingGoal];

        const trainings = distributeWeeklyVolumesWithDays(
          8,
          "5K",
          goalMinutesData,
          lastUserGoal.weeklyFrequency,
          "MINUTES",
          getStartDate(),
          userData.trainingLevel!,
          lastUserTest.vam!,
          lastUserTest,
        );

        return c.json(
          {
            success: true,
            message: "Periodização gerada com sucesso!",
            data: trainings,
          },
          200,
        );
      }
    },
  )
  .get(
    "/:userId/next-workout",
    // loggedIn,
    async (c) => {
      const { userId } = c.req.param();

      const weekMondayStr = format(previousMonday(new Date()), "yyyy-MM-dd");

      const week = await db.query.trainingWeeks.findFirst({
        where: and(
          eq(trainingWeeks.userId, userId),
          gte(trainingWeeks.weekStart, weekMondayStr),
        ),
        orderBy: (trainingWeeks, { asc }) => asc(trainingWeeks.weekStart),
      });

      if (!week) {
        throw new HTTPException(404, {
          message: "Nenhuma semana de treino encontrada",
        });
      }

      const todayStr = format(startOfToday(), "yyyy-MM-dd");

      const nextWorkout = await db.query.workouts.findFirst({
        where: and(
          gte(workoutsTable.scheduledStart, todayStr),
          eq(workoutsTable.trainingWeekId, week.id),
        ),
        orderBy: (workoutsTable, { asc }) => asc(workoutsTable.scheduledStart),
        with: {
          blocks: {
            with: {
              segments: true,
            },
          },
        },
      });

      if (!nextWorkout) {
        throw new HTTPException(404, { message: "Nenhum treino encontrado" });
      }

      return c.json<SuccessResponse<WorkoutSelect>>(
        {
          success: true,
          message: "Proxima semana de treinamento",
          data: nextWorkout as WorkoutSelect,
        },
        200,
      );
    },
  )
  .get("/:userId/training-zones", loggedIn, async (c) => {
    const { userId } = c.req.param();

    const trainingZones = await db.query.trainingZones.findMany({
      where: eq(trainingZonesTable.userId, userId),
      orderBy: (trainingZonesTable, { asc }) => asc(trainingZonesTable.name),
    });

    if (!trainingZones) {
      throw new HTTPException(404, {
        message: "Nenhuma zona de treino encontrada",
      });
    }

    return c.json<SuccessResponse<TraningZoneSelect[]>>(
      {
        success: true,
        message: "Zonas de treino encontradas",
        data: trainingZones,
      },
      200,
    );
  })
  .get(
    "/:userId/planning",
    // loggedIn,
    async (c) => {
      const { userId } = c.req.param();

      const planning = await db.query.trainingWeeks.findMany({
        where: eq(trainingWeeks.userId, userId),
        with: {
          workouts: {
            with: {
              blocks: {
                with: {
                  segments: true,
                },
              },
            },
          },
        },
      });

      return c.json<SuccessResponse<PlanningSelect[]>>(
        {
          success: true,
          message: "Planilha de treino encontrada",
          data: planning,
        },
        200,
      );
    },
  )
  .get(
    "/:userId/test-endpoint",
    // loggedIn,
    async (c) => {
      const { userId } = c.req.param();

      return c.json({
        success: true,
        message: `Test fetched successfully ${userId}`,
      });
    },
  );
