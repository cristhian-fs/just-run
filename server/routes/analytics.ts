import { zValidator } from "@hono/zod-validator";
import {
  endOfMonth,
  format,
  previousMonday,
  startOfMonth,
  subDays,
  subWeeks,
  startOfISOWeek,
  endOfISOWeek
} from "date-fns";
import { isMonday } from "date-fns/isMonday";
import { and, asc, eq, gte, inArray, lt, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { db } from "@/db";
import { trainingWeeks, trainingZones, workouts } from "@/db/schemas";
import type { Context } from "@/lib/context";
import { calculateUserWeeklyIntensity } from "@/lib/core/calculations/weekly-intensity";
import { loggedIn } from "@/middlewares/logged-in";
import type {
  ErrorResponse,
  MonthSummary,
  SuccessResponse,
  VolumeProgression,
  WeeklyVolumeData,
  WorkoutSelect,
} from "@/shared/types";
import { workoutAnalytics } from "@/db/schemas/workouts";

export const analyticsRouter = new Hono<Context>()
  .get("/weekly-volume", loggedIn, async (c) => {
    const userContext = c.get("user");
    if (!userContext) {
      throw new Error("User not found");
    }
    const { id: userId } = userContext;

    const today = new Date();
    const lastWeekStartStr = format(startOfISOWeek(subWeeks(today, 1)), 'yyyy-MM-dd');
    const currentWeekStartStr = format(startOfISOWeek(today), 'yyyy-MM-dd');
    const currentWeekEndStr = format(endOfISOWeek(today), 'yyyy-MM-dd');

    const result = await db.execute(sql`
  WITH weekly_totals AS (
    SELECT
      /* Meta da semana atual */
      SUM(
        CASE
          WHEN ${workouts.scheduledStart} >= ${currentWeekStartStr}
           AND ${workouts.scheduledStart} < ${currentWeekEndStr}
          THEN ${workouts.plannedDistanceM}
          ELSE 0
        END
      ) AS current_week_goal,

      /* Volume atual */
      SUM(
        CASE
          WHEN ${workouts.scheduledStart} >= ${currentWeekStartStr}
           AND ${workouts.scheduledStart} < ${currentWeekEndStr}
           AND ${workouts.isCompleted} = true
          THEN ${workouts.actualDistanceM}
          ELSE 0
        END
      ) AS current_week_volume,

      /* Volume semana anterior */
      SUM(
        CASE
          WHEN ${workouts.scheduledStart} >= ${lastWeekStartStr}
           AND ${workouts.scheduledStart} < ${currentWeekStartStr}
           AND ${workouts.isCompleted} = true
          THEN ${workouts.actualDistanceM}
          ELSE 0
        END
      ) AS last_week_volume

    FROM ${workouts}
    WHERE
      ${workouts.userId} = ${userId}
      AND ${workouts.scheduledStart} >= ${lastWeekStartStr}
  )

  SELECT
    current_week_goal,
    current_week_volume,
    last_week_volume,

    CASE
      WHEN current_week_goal = 0
      THEN 0
      ELSE (current_week_volume * 100.0) / current_week_goal
    END AS week_progress,

    CASE
      WHEN last_week_volume = 0
      THEN 0
      ELSE ((current_week_volume - last_week_volume) * 100.0) / last_week_volume
    END AS progress_over_week

  FROM weekly_totals
`);

    const resultData = result[0] as {
      current_week_goal: string;
      current_week_volume: string;
      last_week_volume: string;
      week_progress: string;
      progress_over_week: string;
    }

    const responseData: WeeklyVolumeData = {
      weekGoalM: Number(resultData.current_week_goal),
      currentWeekVolume: Number(resultData.current_week_volume),
      lastWeekVolume: Number(resultData.last_week_volume),
      weekProgress: Number(resultData.week_progress),
      progressOverWeek: Number(resultData.progress_over_week),
    };


    return c.json<SuccessResponse<WeeklyVolumeData>>(
      {
        success: true,
        message: "Volume da semana obtido com sucesso",
        data: responseData,
      },
      200,
    );
  })
  .get("/monthly-summary", loggedIn, async (c) => {
    const userContext = c.get("user");
    if (!userContext) {
      throw new Error("User not found");
    }
    const { id: userId } = userContext;

    const startOfTheMonthStr = format(startOfMonth(new Date()), "yyyy-MM-dd");
    const endOfMonthStr = format(endOfMonth(new Date()), "yyyy-MM-dd");

    const trainingWeekIds = db
      .select({ id: trainingWeeks.id })
      .from(trainingWeeks)
      .where(eq(trainingWeeks.userId, userId));

    const monthWorkouts = await db
      .select()
      .from(workouts)
      .where(
        and(
          inArray(workouts.trainingWeekId, trainingWeekIds),
          gte(workouts.scheduledStart, startOfTheMonthStr),
          lte(workouts.scheduledStart, endOfMonthStr),
        ),
      );

    const monthSummary: MonthSummary = {
      avgPaceS: 0,
      goalDistance: 0,
      totalDistance: 0,
      totalRuns: 0,
      totalTimeMinutes: 0,
    };

    const totalSecondsTraining = monthWorkouts
      .filter((workout) => workout.isCompleted)
      .reduce((acc, workout) => acc + (workout.actualDurationS ?? 0), 0);

    const totalDistanceTraining = monthWorkouts
      .filter((workout) => workout.isCompleted)
      .reduce((acc, workout) => acc + (workout.actualDistanceM ?? 0), 0);

    if (totalSecondsTraining > 0 && totalDistanceTraining > 0) {
      monthSummary.avgPaceS = Math.floor(
        (totalSecondsTraining / totalDistanceTraining) * 1_000,
      );
    }

    monthSummary.totalRuns = monthWorkouts.filter(
      (workout) => workout.isCompleted,
    ).length;

    monthSummary.totalDistance = monthWorkouts
      .filter((workout) => workout.isCompleted)
      .reduce((acc, curr) => acc + (curr.actualDistanceM ?? 0), 0);

    monthSummary.goalDistance = monthWorkouts.reduce(
      (acc, curr) => acc + (curr.plannedDistanceM ?? 0),
      0,
    );

    monthSummary.totalTimeMinutes = monthWorkouts
      .filter((workout) => workout.isCompleted)
      .reduce(
        (acc, curr) => acc + Math.floor((curr.actualDurationS ?? 0) / 60),
        0,
      );

    return c.json<SuccessResponse<MonthSummary>>({
      success: true,
      message: "Resumo mensal obtido com sucesso",
      data: monthSummary as MonthSummary,
    });
  })
  .get(
    "/volume-progression",
    loggedIn,
    zValidator(
      "query",
      z.object({
        period: z.enum(["7 days", "14 days", "30 days"]).default("7 days"),
      }),
    ),
    async (c) => {
      const userContext = c.get("user");
      if (!userContext) {
        throw new Error("User not found");
      }
      const { id: userId } = userContext;
      const { period } = c.req.query();

      const getStartDate = (period: "7 days" | "14 days" | "30 days") => {
        switch (period) {
          case "7 days":
            return format(subDays(new Date(), 7), "yyyy-MM-dd");
          case "14 days":
            return format(subDays(new Date(), 14), "yyyy-MM-dd");
          case "30 days":
            return format(subDays(new Date(), 30), "yyyy-MM-dd");
          default:
            return format(subDays(new Date(), 7), "yyyy-MM-dd");
        }
      };
      const endDateStr = format(new Date(), "yyyy-MM-dd");
      const startDateStr = getStartDate(
        period as "7 days" | "14 days" | "30 days",
      );

      const trainingWeekIds = db
        .select({ id: trainingWeeks.id })
        .from(trainingWeeks)
        .where(eq(trainingWeeks.userId, userId));

      const periodWorkouts = await db
        .select({
          date: workouts.scheduledStart,
          volume: workouts.actualDistanceM,
          minutes: workouts.actualDurationS,
        })
        .from(workouts)
        .where(
          and(
            eq(workouts.isCompleted, true),
            inArray(workouts.trainingWeekId, trainingWeekIds),
            gte(workouts.scheduledStart, startDateStr),
            lte(workouts.scheduledStart, endDateStr),
          ),
        )
        .orderBy(asc(workouts.scheduledStart));

      return c.json<SuccessResponse<VolumeProgression[]>>({
        success: true,
        message: "Progresso de volume obtido com sucesso",
        data: periodWorkouts,
      });
    },
  )
  .get("/weekly-intensity-volume", loggedIn, async (c) => {
    const userContext = c.get("user");

    if (!userContext) {
      throw new Error("User not found");
    }

    const { id: userId } = userContext;

    const today = new Date();
    const currentWeekStartStr = format(startOfISOWeek(today), 'yyyy-MM-dd');
    const currentWeekEndStr = format(endOfISOWeek(today), 'yyyy-MM-dd');

    const currentWeekWorkouts = await db.query.workouts.findMany({
      where: and(
        eq(workouts.userId, userId),
        gte(workouts.scheduledStart, currentWeekStartStr),
        lte(workouts.scheduledStart, currentWeekEndStr),
      ),
      with: {
        blocks: {
          with: {
            segments: true,
          },
        },
        segments: true,
      },
    });

    const currentUserTrainingZones = await db.query.trainingZones.findMany({
      where: eq(trainingZones.userId, userId),
    });

    if (!currentUserTrainingZones) {
      throw new HTTPException(500, {
        message: "Nenhuma zona de treinamento encontrada",
      });
    }

    const calculatedWeeklyIntensity = calculateUserWeeklyIntensity({
      trainingZones: currentUserTrainingZones,
      workouts: currentWeekWorkouts,
    });

    return c.json({
      data: calculatedWeeklyIntensity,
      success: true,
      message: "Intensidade semanal obtida com sucesso",
    });
  }).get('/plan-analytics', loggedIn, async (c) => {

    const userContext = c.get("user");

    if (!userContext) {
      throw new Error("User not found");
    }

    const { id: userId } = userContext;

    const workoutAnalyticsData = await db.query.workoutAnalytics.findMany({
      where: eq(workoutAnalytics.userId, userId)
    });

    return c.json({
      data: workoutAnalyticsData,
      success: true,
      message: "Analise de planos concluidos obtida com sucesso"
    })

  }).get('/plan-analytics/:id', loggedIn, async (c) => {

    const { id } = c.req.param();
    const userContext = c.get("user");

    if (!userContext) {
      throw new Error("User not found");
    }

    const { id: userId } = userContext;

    const workoutAnalyticsData = await db.query.workoutAnalytics.findFirst({
      where: and(eq(workoutAnalytics.userId, userId), eq(workoutAnalytics.id, id)),
      with: {
        plan: true
      }
    });

    return c.json({
      data: workoutAnalyticsData,
      success: true,
      message: "Analise de plano obtido com sucesso"
    })

  })
