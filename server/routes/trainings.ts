import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { and, eq, gte, inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  goal,
  tests,
  trainingWeeks,
  trainingZones as trainingZonesTable,
  user,
  workoutLogs,
  workouts as workoutsTable,
} from "@/db/schemas";
import { workouts } from "@/db/schemas/workouts";
import { loggedIn } from "@/middlewares/logged-in";
import { TrainingWeekOrchestratorService } from "@/services";
import { zValidator } from "@hono/zod-validator";
import { format } from "date-fns";
import { isMonday } from "date-fns/fp";
import { previousMonday } from "date-fns/previousMonday";
import { startOfToday } from "date-fns/startOfToday";
import { z } from "zod";

import {
  newPeriodizationPlanSchema,
  registerWorkoutSchema,
} from "@/shared/schemas";
import {
  type PlanningSelect,
  type SuccessResponse,
  type TestSelect,
  type TrainingGoal,
  type TraningZoneSelect,
  type WeekAmount,
  type WorkoutSelect,
  type WorkoutWithBlocks,
} from "@/shared/types";
import {
  defaultWeeklyMinutesByGoal,
  goalToRacePlan,
} from "@/lib/config/training-goals";
import type { Context } from "@/lib/context";
import { getStartDate } from "@/lib/core/calculations/time";
import { distributeWeeklyVolumesWithDays } from "@/lib/core/generators/dayly-distribution";

export const trainingRouter = new Hono<Context>()
  .post("/generate", loggedIn, async (c) => {
    const userContext = c.get("user");

    if (!userContext) {
      throw new Error("User not found");
    }

    const { id } = userContext;
    const userData = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!userData) {
      return c.json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    const lastUserTest = await db.query.tests.findFirst({
      where: eq(tests.userId, id),
      orderBy: (tests, { desc }) => desc(tests.createdAt),
    });
    const lastUserGoal = await db.query.goal.findFirst({
      where: eq(goal.userId, id),
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

      const trainings = distributeWeeklyVolumesWithDays({
        weeks: 8,
        race,
        baseValuePerWeek: weeklyKm,
        weeklyFrequency: lastUserGoal.weeklyFrequency,
        unit: userData.trainingLevel === "beginner" ? "KM" : "MINUTES",
        startDate: getStartDate(),
        trainingLevel: userData.trainingLevel!,
        vam: lastUserTest.vam!,
        testData: lastUserTest,
      });
      await TrainingWeekOrchestratorService.saveTrainingWeekWithWorkouts({
        userId: id,
        trainings,
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

      const trainings = distributeWeeklyVolumesWithDays({
        weeks: 8,
        race: "5K",
        baseValuePerWeek: goalMinutesData,
        weeklyFrequency: lastUserGoal.weeklyFrequency,
        unit: userData.trainingLevel === "beginner" ? "KM" : "MINUTES",
        startDate: getStartDate(),
        trainingLevel: userData.trainingLevel!,
        vam: lastUserTest.vam!,
        testData: lastUserTest,
      });

      return c.json(
        {
          success: true,
          message: "Periodização gerada com sucesso!",
          data: trainings,
        },
        200,
      );
    }
  })
  .get("/next-workout", loggedIn, async (c) => {
    const userContext = c.get("user");

    if (!userContext) {
      throw new Error("User not found");
    }

    const { id } = userContext;

    const today = new Date();
    const weekMondayStr = isMonday(today)
      ? format(today, "yyyy-MM-dd")
      : format(previousMonday(today), "yyyy-MM-dd");

    const week = await db.query.trainingWeeks.findFirst({
      where: and(
        eq(trainingWeeks.userId, id),
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
  })
  .get("/training-zones", loggedIn, async (c) => {
    const userContext = c.get("user");

    if (!userContext) {
      throw new Error("User not found");
    }

    const { id: userId } = userContext;

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
  .get("/planning", loggedIn, async (c) => {
    const userContext = c.get("user");

    if (!userContext) {
      throw new Error("User not found");
    }

    const { id: userId } = userContext;

    const planning = await db.query.trainingWeeks.findMany({
      where: eq(trainingWeeks.userId, userId),
      with: {
        workouts: true,
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
  })
  .get(
    "/workout/:workoutId",
    loggedIn,
    zValidator(
      "param",
      z.object({
        workoutId: z.string(),
      }),
    ),
    async (c) => {
      const userContext = c.get("user");
      if (!userContext) {
        throw new Error("User not found");
      }
      const { id: userId } = userContext;
      const { workoutId } = c.req.param();

      const trainingWeekIds = db
        .select({ id: trainingWeeks.id })
        .from(trainingWeeks)
        .where(eq(trainingWeeks.userId, userId));

      const workout = await db.query.workouts.findFirst({
        where: and(
          eq(workouts.id, workoutId),
          inArray(workouts.trainingWeekId, trainingWeekIds),
        ),
        with: {
          blocks: {
            with: {
              segments: true,
            },
          },
        },
      });

      if (!workout) {
        throw new HTTPException(404, { message: "Nenhum treino encontrado" });
      }

      return c.json<SuccessResponse<WorkoutWithBlocks>>(
        {
          success: true,
          message: "Treino encontrado",
          data: workout as WorkoutWithBlocks,
        },
        200,
      );
    },
  )
  .post(
    "/register-workout/:workoutId",
    loggedIn,
    zValidator("param", z.object({ workoutId: z.string() })),
    zValidator("form", registerWorkoutSchema),
    async (c) => {
      const userContext = c.get("user");
      if (!userContext) {
        throw new Error("User not found");
      }
      const { id: userId } = userContext;
      const { workoutId } = c.req.param();
      const { duration, distance, perceivedEffort, observations } =
        c.req.valid("form");

      const distanceInMeters = Number.parseFloat(distance) * 1_000;
      const [hh, mm, ss] = duration.split(":") as [string, string, string];

      const durationInS =
        Number.parseInt(hh) * 3600 +
        Number.parseInt(mm) * 60 +
        Number.parseInt(ss);

      const avgPaceSPerKm = Math.floor(durationInS / (distanceInMeters / 1000));

      const workoutLogId = await db.transaction(async (tx) => {
        await tx
          .update(workouts)
          .set({
            isCompleted: true,
            actualDistanceM: distanceInMeters,
            actualDurationS: durationInS,
            avgPaceSPerKm,
          })
          .where(eq(workouts.id, workoutId));

        const [logId] = await tx
          .insert(workoutLogs)
          .values({
            notes: observations,
            workoutId,
            userId,
            actualTimeS: durationInS,
            actualDistanceM: distanceInMeters,
            perceivedEffort: Number.parseInt(perceivedEffort),
            createdAt: new Date(),
          })
          .returning({ id: workoutLogs.id });

        return logId;
      });

      if (!workoutLogId) {
        throw new HTTPException(500, {
          message: "Falha ao registrar treino",
        });
      }

      return c.json<SuccessResponse<{ id: string }>>(
        {
          success: true,
          message: "Treino registrado com sucesso",
          data: workoutLogId,
        },
        200,
      );
    },
  )
  .post(
    "/new-periodization-plan",
    loggedIn,
    zValidator("form", newPeriodizationPlanSchema),
    async (c) => {
      const userContext = c.get("user");
      if (!userContext) {
        throw new Error("User not found");
      }
      const { id: userId } = userContext;

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

      const {
        race,
        baseValuePerWeek,
        weeklyFrequency,
        startDate,
        weeks,
        unit,
      } = c.req.valid("form");

      const trainings = distributeWeeklyVolumesWithDays({
        weeks: weeks as WeekAmount,
        baseValuePerWeek: baseValuePerWeek as number,
        race,
        startDate,
        testData: lastUserTest,
        trainingLevel: userData.trainingLevel!,
        unit,
        vam: lastUserTest.vam!,
        weeklyFrequency,
      });

      await TrainingWeekOrchestratorService.saveTrainingWeekWithWorkouts({
        userId,
        trainings,
      });

      return c.json<SuccessResponse>(
        {
          success: true,
          message: "Periodização gerada com sucesso!",
        },
        200,
      );
    },
  )
  .get("/last-running-test", loggedIn, async (c) => {
    const userContext = c.get("user");
    if (!userContext) {
      throw new Error("User not found");
    }
    const { id: userId } = userContext;

    const lastUserTest = await db.query.tests.findFirst({
      where: eq(tests.userId, userId),
      orderBy: (tests, { desc }) => desc(tests.createdAt),
    });

    if (!lastUserTest) {
      throw new HTTPException(404, { message: "Nenhum teste encontrado" });
    }

    return c.json<SuccessResponse<TestSelect>>(
      {
        success: true,
        message: "Último teste realizado encontrado",
        data: lastUserTest,
      },
      200,
    );
  });
