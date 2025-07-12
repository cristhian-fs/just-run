import { Hono } from "hono";
import { and, asc, eq, gte, inArray, lt, lte } from "drizzle-orm";

import { db } from "@/db";
import { trainingWeeks, workouts } from "@/db/schemas";
import { zValidator } from "@hono/zod-validator";
import { format, previousMonday, subDays } from "date-fns";
import { endOfMonth, startOfMonth } from "date-fns/fp";
import { isMonday } from "date-fns/isMonday";
import { z } from "zod";

import type {
  ErrorResponse,
  MonthSummary,
  SuccessResponse,
  VolumeProgression,
  WeeklyVolumeData,
  WorkoutSelect,
} from "@/shared/types";
import { type Context } from "@/lib/context";

const calculateCompletedVolume = (workouts: WorkoutSelect[]): number => {
  return workouts
    .filter((workout) => workout.isCompleted)
    .reduce((acc, curr) => acc + (curr.actualDistanceM ?? 0), 0);
};

// Função para calcular o progresso percentual
const calculateProgress = (current: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.round((current / goal) * 100);
};

// Função para calcular o progresso em relação à semana anterior
const calculateProgressOverWeek = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // Se não havia volume anterior e agora há, é 100% de crescimento
  }
  return Math.round(((current - previous) / previous) * 100);
};

export const analyticsRouter = new Hono<Context>()
  .get("/:userId/weekly-volume", async (c) => {
    const { userId } = c.req.param();

    const today = new Date();
    const weekMondayStr = isMonday(today)
      ? format(today, "yyyy-MM-dd")
      : format(previousMonday(today), "yyyy-MM-dd");

    const lastWeekMondayStr = format(previousMonday(today), "yyyy-MM-dd");

    const [currentWeek, lastWeek] = await Promise.all([
      db.query.trainingWeeks.findFirst({
        where: and(
          eq(trainingWeeks.userId, userId),
          gte(trainingWeeks.weekStart, weekMondayStr),
        ),
        orderBy: (trainingWeeks, { asc }) => asc(trainingWeeks.weekStart),
      }),
      db.query.trainingWeeks.findFirst({
        where: and(
          eq(trainingWeeks.userId, userId),
          gte(trainingWeeks.weekStart, lastWeekMondayStr),
          lt(trainingWeeks.weekStart, weekMondayStr), // Garantir que é a semana anterior
        ),
        orderBy: (trainingWeeks, { desc }) => desc(trainingWeeks.weekStart),
      }),
    ]);

    if (!currentWeek) {
      return c.json<ErrorResponse>({
        success: false,
        error: "Nenhuma semana de treino encontrada",
      });
    }
    const [weekWorkouts, lastWeekWorkouts] = await Promise.all([
      db.query.workouts.findMany({
        where: eq(workouts.trainingWeekId, currentWeek.id),
      }),
      lastWeek
        ? db.query.workouts.findMany({
            where: eq(workouts.trainingWeekId, lastWeek.id),
          })
        : Promise.resolve([]),
    ]);

    if (!weekWorkouts) {
      return c.json<ErrorResponse>({
        success: false,
        error: "Nenhum treino encontrado",
      });
    }

    const currentWeekVolume = calculateCompletedVolume(weekWorkouts);
    const lastWeekVolume = calculateCompletedVolume(lastWeekWorkouts);
    const weekGoalM = currentWeek.totalVolumeMin * 1_000;

    // Calcular progressos
    const weekProgress = calculateProgress(currentWeekVolume, weekGoalM);
    const progressOverWeek = calculateProgressOverWeek(
      currentWeekVolume,
      lastWeekVolume,
    );

    const responseData: WeeklyVolumeData = {
      weekGoalM,
      currentWeekVolume,
      lastWeekVolume,
      weekProgress,
      progressOverWeek,
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
  .get(
    "/:userId/monthly-summary",
    zValidator(
      "param",
      z.object({
        userId: z.string(),
      }),
    ),
    async (c) => {
      const { userId } = c.req.param();

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
    },
  )
  .get(
    "/:userId/volume-progression",
    zValidator(
      "query",
      z.object({
        period: z.enum(["7 days", "14 days", "30 days"]).default("7 days"),
      }),
    ),
    async (c) => {
      const { userId } = c.req.param();
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
  );
