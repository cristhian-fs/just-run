import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { goal, tests, trainingWeeks, user, workouts } from "@/db/schemas";
import { workoutBlocks } from "@/db/schemas/workouts";
import { loggedIn } from "@/middlewares/logged-in";
import { addDays } from "date-fns";

import type { TrainingGoal } from "@/shared/types";
import { goalToRacePlan } from "@/lib/config/training-goals";
import type { Context } from "@/lib/context";
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
        "KM",
        addDays(new Date(), 1),
        userData.trainingLevel!,
        lastUserTest.vam!,
      );

      await db.transaction(async (tx) => {
        await tx.delete(trainingWeeks).where(eq(trainingWeeks.userId, userId));

        for (const week of trainings) {
          const [insertedWeek] = await tx
            .insert(trainingWeeks)
            .values({
              userId,
              weekType: week.weekType,
              weekStart: formatDate(new Date(week.weekStart)),
              totalVolumeMin: week.totalVolumeMin,
              createdAt: new Date(),
            })
            .returning({ id: trainingWeeks.id });

          // percorre os workouts da semana recém-inserida
          for (const workout of week.workouts) {
            if (!insertedWeek?.id) return;

            if (workout.type === "INTERVAL") {
              await tx
                .insert(workouts)
                .values({
                  trainingWeekId: insertedWeek.id,
                  type: "INTERVAL",
                  date: formatDate(new Date(workout.date)),
                  unit: workout.unit,
                  totalReps: workout.reps,
                  restBetweenRepsMin: workout.restDurationSeconds,
                  isCompleted: false,
                  targetZones: workout.targetZones,
                  cooldownDistanceKm: workout.cooldownDistanceKm,
                  warmupDistanceKm: workout.warmUpDistanceKm,
                  repsPace: workout.repsPace,
                  restType: workout.restType.toUpperCase(),
                  repsDistanceKm: workout.repsDistanceKm,
                } as typeof workouts.$inferInsert)
                .returning({ id: workouts.id });
            }

            if (workout.type === "FARTLEK") {
              const [insertedWorkout] = await tx
                .insert(workouts)
                .values({
                  trainingWeekId: insertedWeek.id,
                  type: "FARTLEK",
                  description: workout.name,
                  unit: workout.unit,
                  totalVolume: workout.totalVolume,
                  intenseVolume: workout.intenseVolume,
                  date: formatDate(new Date(workout.date)),
                  isCompleted: false,
                })
                .returning({ id: workouts.id });

              if (workout.blocks && insertedWorkout?.id) {
                workout.blocks.map(async (block, index) => {
                  await tx.insert(workoutBlocks).values({
                    effort: block.effort,
                    duration: block.duration,
                    order: index,
                    workoutId: insertedWorkout.id,
                  } as typeof workoutBlocks.$inferInsert);
                });
              }
            }

            if (workout.type === "PROGRESSIVE_RUN") {
              const [insertedWorkout] = await tx
                .insert(workouts)
                .values({
                  description: workout.name,
                  date: formatDate(new Date(workout.date)),
                  type: "PROGRESSIVE_RUN",
                  totalVolume: workout.totalVolume,
                  trainingWeekId: insertedWeek.id,
                  isCompleted: false,
                })
                .returning({ id: workouts.id });

              if (workout.blocks && insertedWorkout?.id) {
                workout.blocks.map(async (block, index) => {
                  await tx.insert(workoutBlocks).values({
                    order: index,
                    vamIntensity: block.vamIntensity,
                    pace: block.pace,
                    distanceKm: block.distanceKm,
                    type: block.type,
                  } as typeof workoutBlocks.$inferInsert);
                });
              }
            }

            if (
              workout.type === "THRESHOLD_RUN" &&
              workout.unit === "MINUTES"
            ) {
              await tx.insert(workouts).values({
                isCompleted: false,
                trainingWeekId: insertedWeek.id,
                date: formatDate(new Date(workout.date)),
                type: "THRESHOLD_RUN",
                description: workout.name,
                unit: workout.unit,
                totalReps: workout.reps,
                targetZones: workout.targetZones,
                durationMin: workout.totalWorkMin,
                warmupDistanceKm: workout.wam ? workout.wam : 0,
                pace: workout.pace,
                cooldownDistanceKm: workout.cooldown ? workout.cooldown : 0,
              } as typeof workouts.$inferInsert);
            }

            if (workout.type === "THRESHOLD_RUN" && workout.unit === "KM") {
              await tx
                .insert(workouts)
                .values({
                  isCompleted: false,
                  trainingWeekId: insertedWeek.id,
                  date: formatDate(new Date(workout.date)),
                  type: "THRESHOLD_RUN",
                  description: workout.name,
                  unit: workout.unit,
                  totalReps: workout.reps,
                  targetZones: workout.targetZones,
                  durationMin: workout.totalWorkMin,
                  warmupDistanceKm: workout.wam ? workout.wam : 0,
                  pace: workout.pace,
                  cooldownDistanceKm: workout.cooldown ? workout.cooldown : 0,
                  restBetweenRepsMin: workout.restDurationSeconds,
                } as typeof workouts.$inferInsert)
                .returning({ id: workouts.id });
            }

            if (
              workout.type === "LONG_RUN" ||
              workout.type === "EASY_RUN" ||
              workout.type === "RECOVERY_RUN"
            ) {
              const [insertedWorkout] = await tx
                .insert(workouts)
                .values({
                  type: workout.type,
                  trainingWeekId: insertedWeek.id,
                  description: workout.name,
                  isCompleted: false,
                  date: formatDate(new Date(workout.date)),
                  totalVolume: workout.totalVolume,
                } as typeof workouts.$inferInsert)
                .returning({ id: workouts.id });

              if (workout.blocks && insertedWorkout?.id) {
                workout.blocks.map(async (block, index) => {
                  await tx.insert(workoutBlocks).values({
                    vamIntensity: block.vamIntensity,
                    distanceKm: block.distanceKm,
                    pace: block.pace,
                    order: index,
                    workoutId: insertedWorkout.id,
                  });
                });
              }
            }
          }
        }
      });

      return c.json({
        success: true,
        message: "Onboarding completed successfully",
      });
    }

    return c.json({
      success: true,
      message: "Training plan generated successfully",
    });
  },
);
