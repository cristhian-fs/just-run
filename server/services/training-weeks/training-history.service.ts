import type {
  PlanningSelect,
  RunTypeBreakdown,
  TTrainingType,
  WorkoutAnalyticsData,
} from "@/shared/types";
import { getISOWeek, getISOWeekYear } from "date-fns/fp";

interface TrainingHistoryServiceProps {
  planningSelect: PlanningSelect[];
  activePlan: {
    id?: string;
    name: string;
    userId: string;
  };
}

function getWeekKey(date: Date) {
  const week = getISOWeek(date);
  const year = getISOWeekYear(date);
  return `${year}-W${week}`
}

export async function TrainingHistoryService({
  activePlan,
  planningSelect,
}: TrainingHistoryServiceProps): Promise<WorkoutAnalyticsData> {
  const planningWorkouts = planningSelect.flatMap((week) => week.workouts);
  const completedWorkouts = planningWorkouts.filter(
    (workout) => workout.isCompleted,
  );

  const workoutsByWeek = completedWorkouts.reduce<Record<string, number>>(
    (acc, w) => {
      const weekKey = getWeekKey(new Date(w.scheduledStart));
      acc[weekKey] = (acc[weekKey] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const weeks = Object.values(workoutsByWeek);
  const avgWorkoutsPerWeek =
    weeks.length > 0
      ? weeks.reduce((a, b) => a + b, 0) / weeks.length
      : 0;

  const TARGET_WORKOUTS_PER_WEEK = 7;

  const consistencyScoreNormalized = Math.min(
    avgWorkoutsPerWeek / TARGET_WORKOUTS_PER_WEEK,
    1
  );

  const consistencyScore = consistencyScoreNormalized * 100;

  const sortedByDate = [...completedWorkouts].sort(
    (a, b) =>
      new Date(a.scheduledStart).getTime() -
      new Date(b.scheduledStart).getTime()
  );

  const mid = Math.floor(sortedByDate.length / 2);

  const firstHalf = sortedByDate.slice(0, mid);
  const secondHalf = sortedByDate.slice(mid);

  function avgPace(workouts: typeof completedWorkouts) {
    const valid = workouts.filter(w => w.avgPaceSPerKm && w.avgPaceSPerKm > 0);
    if (!valid.length) return 0;

    return (
      valid.reduce((sum, w) => sum + (w.avgPaceSPerKm ?? 0), 0) / valid.length
    );
  }

  const paceStart = avgPace(firstHalf);
  const paceEnd = avgPace(secondHalf);

  const paceImprovement =
    paceStart > 0 && paceEnd > 0
      ? ((paceStart - paceEnd) / paceStart) * 100
      : 0;

  const initialAcc = {
    totalDistanceM: 0,
    totalDurationS: 0,
    totalPace: 0,
    totalHr: 0,
    count: 0,
    fastestPace: Infinity,
    longestDistance: 0,
    longestDuration: 0,
    runTypeBreakdown: {} as RunTypeBreakdown,
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  const stats = completedWorkouts.reduce((acc, item) => {
    const dist = item.actualDistanceM ?? 0;
    const dur = item.actualDurationS ?? 0;
    const pace = item.avgPaceSPerKm ?? 0;
    const hr = item.avgHr ?? 0;

    acc.totalDistanceM += dist;
    acc.totalDurationS += dur;
    acc.totalPace += pace;
    acc.totalHr += hr;
    acc.count += 1;

    acc.fastestPace = Math.min(acc.fastestPace, pace || acc.fastestPace);
    acc.longestDistance = Math.max(acc.longestDistance, dist);
    acc.longestDuration = Math.max(acc.longestDuration, dur);

    if (!acc.startDate || new Date(item.scheduledStart) < acc.startDate) {
      acc.startDate = new Date(item.scheduledStart);
    }
    if (!acc.endDate || new Date(item.scheduledStart) > acc.endDate) {
      acc.endDate = new Date(item.scheduledStart);
    }

    const rt = item.runType;
    if (!acc.runTypeBreakdown[rt]) {
      acc.runTypeBreakdown[rt] = {
        count: 0,
        totalDistanceM: 0,
        totalDurationS: 0,
        avgPace: 0,
        avgHr: 0,
      };
    }

    const rtb = acc.runTypeBreakdown[rt];
    rtb.count += 1;
    rtb.totalDistanceM += dist;
    rtb.totalDurationS += dur;
    rtb.avgPace += pace;
    rtb.avgHr += hr;

    return acc;
  }, initialAcc);

  const runTypeBreakdown = Object.entries(stats.runTypeBreakdown).reduce(
    (acc, [rt, val]) => {
      acc[rt as TTrainingType] = {
        ...val,
        avgPace: val.count ? val.avgPace / val.count : 0,
        avgHr: val.count ? val.avgHr / val.count : 0,
      };
      return acc;
    },
    {} as RunTypeBreakdown,
  );

  return {
    metadata: {
      planId: activePlan.id,
      planName: activePlan.name,
      userId: activePlan.userId,
    },
    summary: {
      avgHrOverall: stats.count ? stats.totalHr / stats.count : 0,
      avgPaceOverall: stats.count ? stats.totalPace / stats.count : 0,
      dateRange: {
        startDate: stats.startDate?.toISOString() ?? "",
        endDate: stats.endDate?.toISOString() ?? "",
      },
      totalDistanceM: stats.totalDistanceM,
      totalDurationS: stats.totalDurationS,
      totalElevationGainM: 0,
      totalWorkouts: stats.count,
    },
    progressMetrics: {
      improvementTrends: {
        completionRate:
          planningWorkouts.length > 0
            ? (completedWorkouts.length / planningWorkouts.length) * 100
            : 0,
        consistencyScore,
        paceImprovement,
      },
      personalBests: {
        fastestPace: stats.fastestPace === Infinity ? 0 : stats.fastestPace,
        longestDistance: stats.longestDistance,
        longestDuration: stats.longestDuration,
      },
    },
    runTypeBreakdown,
    workouts: completedWorkouts.map((w) => ({
      id: w.id,
      scheduledStart: new Date(w.scheduledStart).toISOString(),
      runType: w.runType,
      title: w.title ?? "",

      planned: {
        distanceM: w.plannedDistanceM ?? 0,
        durationS: w.plannedDurationS ?? 0,
      },

      actual: {
        distanceM: w.actualDistanceM ?? 0,
        durationS: w.actualDurationS ?? 0,
        avgPaceSPerKm: w.avgPaceSPerKm ?? 0,
        avgHr: w.avgHr ?? 0,
        elevationGainM: w.elevationGainM ?? 0,
      },

      performance: {
        paceVariance: 0,
        completionRate: 0,
      },
    })),
  };
}
