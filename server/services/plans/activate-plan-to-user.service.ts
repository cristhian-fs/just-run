import { addDays, differenceInDays } from "date-fns";
import { db } from "@/db";
import { blocks, segmentsTable, trainingWeeks, workouts } from "@/db/schemas";
import { PhysiologyCalculator } from "@/lib/core/vdot/physiology-calculator";
import { HeartRaceZone } from "@/lib/core/vdot/types";
import { formatDate } from "@/lib/utils";
import type { weekTypes } from "@/shared/constants/training.constants";
import type {
  Block,
  Segment,
  TrainingPlanSegment,
  TrainingPlanSelect,
  Week,
  Workout,
} from "@/shared/types";

type TCovertPlanData = {
  plan: TrainingPlanSelect;
  userTest: {
    distance: number;
    duration: number;
  };
  startDate?: Date;
  endDate?: Date;
};

export function getWeekType({
  week,
  index,
  weeks,
  avgVolume,
  maxVolume,
}: {
  week: Week;
  index: number;
  weeks: Week[];
  avgVolume: number;
  maxVolume: number;
}): (typeof weekTypes)[number] {
  const vol = week.totalVolumeMin;
  const lastIndex = weeks.length - 1;

  const rules: { check: boolean; type: (typeof weekTypes)[number] }[] = [
    { check: index === 0 && vol < avgVolume * 0.7, type: "INTRO" },
    { check: vol === maxVolume, type: "PEAK" },
    { check: index === lastIndex, type: "COMPETITION" },
    {
      check: index >= lastIndex - 2 && vol < avgVolume * 0.7,
      type: "TAPER",
    },
    { check: vol > avgVolume * 1.1, type: "BUILD" },
    { check: vol < avgVolume * 0.6, type: "DELOAD" },
  ];

  return rules.find((r) => r.check)?.type ?? "BASE";
}

function getPaceForSegment(
  segment: TrainingPlanSegment,
  userTest: {
    distance: number;
    duration: number;
  },
): number | null {
  const vdotPercentage = PhysiologyCalculator.calculateVDOTPercentage({
    timeInSeconds: userTest.duration,
  });

  const durationS = userTest.duration;
  const distanceMiles = userTest.distance / 1609.34;

  const vdot = PhysiologyCalculator.calculateVDOT({
    distanceM: userTest.distance,
    durationS: userTest.duration,
    VDOTPercentage: vdotPercentage,
  });

  const intervalPaceInSeconds = PhysiologyCalculator.calculatePeriodPace({
    calcVDOT: vdot,
    vdotIntensity: 0.98,
  });

  const repetitionIntervalPaceInSeconds =
    PhysiologyCalculator.calculateRepetitionPace({
      intervalPaceInSeconds,
    });

  const thresholdPace = PhysiologyCalculator.calculatePeriodPace({
    calcVDOT: vdot,
    vdotIntensity: 0.88,
  });

  const totalTimeMarathonProjection =
    PhysiologyCalculator.calculateRaceProjection({
      durationS,
      distanceMiles,
      selectedDistance: HeartRaceZone.Marathon,
    });

  const marathonPaceProjection =
    PhysiologyCalculator.calculateRacePaceProjection({
      selectedDistance: HeartRaceZone.Marathon,
      totalTime: totalTimeMarathonProjection,
    });


  const easyPaceProjection = +PhysiologyCalculator.calculatePace({
    calcVDOT: vdot,
    vdotPercentage: 0.67,
    correctionFactor: 0,
    type: "seconds",
  });

  if (segment.targetPaceReference) {
    switch (segment.targetPaceReference) {
      case "V3000":
        return PhysiologyCalculator.calculateRacePaceProjection({
          selectedDistance: HeartRaceZone.Race3k,
          totalTime: PhysiologyCalculator.calculateRaceProjection({
            selectedDistance: HeartRaceZone.Race3k,
            durationS,
            distanceMiles,
          })
        })
      case "V5000":
        return PhysiologyCalculator.calculateRacePaceProjection({
          selectedDistance: HeartRaceZone.Race5k,
          totalTime: PhysiologyCalculator.calculateRaceProjection({
            durationS,
            distanceMiles,
            selectedDistance: HeartRaceZone.Race5k,
          })
        })
      case "V10000":
        return PhysiologyCalculator.calculateRacePaceProjection({
          selectedDistance: HeartRaceZone.Race10k,
          totalTime: PhysiologyCalculator.calculateRaceProjection({
            selectedDistance: HeartRaceZone.Race10k,
            durationS,
            distanceMiles,
          })
        })
      case "V15000":
        return PhysiologyCalculator.calculateRacePaceProjection({
          selectedDistance: HeartRaceZone.Race15k,
          totalTime: PhysiologyCalculator.calculateRaceProjection({
            selectedDistance: HeartRaceZone.Race15k,
            durationS,
            distanceMiles,
          })
        })
      case "HMP":
        return PhysiologyCalculator.calculateRacePaceProjection({
          selectedDistance: HeartRaceZone.HalfMarathon,
          totalTime: PhysiologyCalculator.calculateRaceProjection({
            selectedDistance: HeartRaceZone.HalfMarathon,
            durationS,
            distanceMiles,
          })
        })
      case "MP":
        return marathonPaceProjection;
      case "LT":
        return thresholdPace;
      case "EASY":
        return easyPaceProjection
      default:
        return easyPaceProjection
    }
  } else {
    switch (segment.segmentKind) {
      case "COOLDOWN":
        return easyPaceProjection;

      case "FLOAT":
        return easyPaceProjection;

      case "INTERVAL":
        return intervalPaceInSeconds;

      case "REPETITION":
        return repetitionIntervalPaceInSeconds;

      case "THRESHOLD":
        return thresholdPace;

      case "MARATHON":
        return marathonPaceProjection;

      case "WARMUP":
        return easyPaceProjection;

      case "WORK":
        return easyPaceProjection;

      case "WALK":
        return 720; // This is a 12/kmh pace while walking

      default:
        return null;
    }
  }
}

function getPlanWindow(startDate: Date, endDate: Date, planWeeks: number) {
  const totalDays = differenceInDays(endDate, startDate) + 1;

  const totalWeeks = Math.ceil(totalDays / 7);

  // Compress adjustment factor
  const adjustmentFactor = planWeeks / totalWeeks;

  return {
    totalDays,
    totalWeeks,
    adjustmentFactor,
  };
}

function compressPlanWeeks<T>(
  planWeeks: T[],
  totalWeeks: number,
  lockLastWeeks: number = 4, // trava as últimas 4 semanas (Peak/Taper/Competition)
): T[] {
  const originalCount = planWeeks.length;

  // Se cabe inteiro, retorna como está
  if (totalWeeks >= originalCount) return planWeeks;

  // Se não sobrar nem espaço pras últimas semanas fixas, força apenas as últimas
  if (totalWeeks <= lockLastWeeks) {
    return planWeeks.slice(-totalWeeks);
  }

  const weeksToDistribute = totalWeeks - lockLastWeeks;
  const compressibleWeeks = originalCount - lockLastWeeks;

  const factor = weeksToDistribute / compressibleWeeks;

  const selected: T[] = [];

  // Seleciona proporcionalmente das semanas iniciais
  for (let i = 0; i < weeksToDistribute; i++) {
    const oldIndex = Math.floor(i / factor);
    if (!planWeeks[oldIndex]) break;
    selected.push(planWeeks[oldIndex]);
  }

  // Junta com as últimas semanas fixas
  return [...selected, ...planWeeks.slice(-lockLastWeeks)];
}

export const convertPlanDataToUserWorkoutsData = ({
  plan,
  userTest,
  startDate,
  endDate,
}: TCovertPlanData) => {
  const startPlanDate = startDate ?? new Date();
  const endPlanDate =
    endDate ?? addDays(startPlanDate, plan.totalWeeks * 7 - 1);

  const { totalWeeks } = getPlanWindow(
    startPlanDate,
    endPlanDate,
    plan.planWeeks.length,
  );

  const redistributedWeeks = compressPlanWeeks(plan.planWeeks, totalWeeks, 4);

  const trainingWeeks: Week[] = redistributedWeeks.map((week, weekIdx) => {
    const weekStart = addDays(startPlanDate, weekIdx * 7);
    const newWorkouts: Workout[] = week.planWorkouts.map((workout, index) => {
      const scheduledStart = addDays(startPlanDate, weekIdx * 7 + index);

      // Atualiza blocos e segmentos
      const newBlocks: Block[] = workout.planBlocks.map((block) => {
        const newSegments: Segment[] = block.planSegments.map(
          (segment, index) => {
            const targetPaceSPerKm = getPaceForSegment(segment, {
              distance: userTest.distance,
              duration: userTest.duration,
            });

            // Calcula plannedDistanceM se não existir
            let plannedDistanceM = segment.plannedDistanceM;
            if (
              (plannedDistanceM === undefined ||
                plannedDistanceM === null ||
                plannedDistanceM === 0) &&
              targetPaceSPerKm &&
              segment.plannedDurationS
            ) {
              plannedDistanceM =
                (segment.plannedDurationS / targetPaceSPerKm) * 1000;
            }

            return {
              orderInBlock: index,
              segmentKind: segment.segmentKind,
              plannedDurationS: segment.plannedDurationS ?? undefined,
              targetPaceSPerKm: targetPaceSPerKm
                ? Math.floor(targetPaceSPerKm)
                : undefined,
              plannedDistanceM: plannedDistanceM
                ? Math.floor(plannedDistanceM)
                : undefined,
            };
          },
        );
        return {
          blockKind: block.blockKind,
          repeatCount: block.repeatCount,
          orderIndex: block.orderIndex,
          description: block.description ?? undefined,
          segments: newSegments,
        };
      });

      // Calcula totais do workout baseado nos segments
      const allSegments = newBlocks.flatMap((block) =>
        block.segments.flatMap((segment) =>
          Array.from({ length: block.repeatCount }, () => segment),
        ),
      );

      const calculatedDistanceM =
        allSegments.reduce((acc, s) => acc + (s.plannedDistanceM ?? 0), 0) ||
        undefined;

      const calculatedDurationS =
        allSegments.reduce((acc, s) => acc + (s.plannedDurationS ?? 0), 0) ||
        undefined;

      const plannedDistanceM =
        workout.plannedDistanceM !== 0 && workout.plannedDistanceM !== null
          ? workout.plannedDistanceM
          : calculatedDistanceM;

      const plannedDurationS =
        workout.plannedDurationS !== 0 && workout.plannedDurationS !== null
          ? workout.plannedDurationS
          : calculatedDurationS;

      return {
        title: workout.title ?? `Treino ${index + 1}`,
        runType: workout.runType,
        notes: workout.notes ?? undefined,
        plannedDistanceM: plannedDistanceM,
        plannedDurationS: plannedDurationS,
        scheduledStart,
        blocks: newBlocks,
      };
    });

    // Calcula o total de volume mínimo da semana
    const totalVolumeMin = Math.floor(
      newWorkouts.reduce((acc, curr) => {
        return acc + (curr.plannedDistanceM ?? 0);
      }, 0) / 1000,
    );

    return {
      weekStart,
      weekType: "BASE",
      totalVolumeMin,
      workouts: newWorkouts,
    };
  });

  const avgVolume =
    trainingWeeks.reduce((acc, w) => acc + w.totalVolumeMin, 0) /
    trainingWeeks.length;

  const maxVolume = Math.max(...trainingWeeks.map((w) => w.totalVolumeMin));

  trainingWeeks.forEach((w, index) => ({
    ...w,
    weekType: getWeekType({
      week: w,
      avgVolume,
      maxVolume,
      index,
      weeks: trainingWeeks,
    }),
  }));

  // biome-ignore lint/correctness/noUnusedVariables: will be replaced
  const { planWeeks, ...rest } = plan;

  return {
    ...rest,
    planWeeks: trainingWeeks,
    totalWeeks,
  };
};

export async function activatePlanToUser({
  plan,
  userTestData,
  userId,
  startDate,
  endDate,
}: {
  plan: TrainingPlanSelect;
  userTestData: {
    distance: number;
    duration: number;
  };
  userId: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const planData = convertPlanDataToUserWorkoutsData({
    plan,
    userTest: {
      distance: userTestData.distance,
      duration: userTestData.duration,
    },
    endDate,
    startDate,
  });

  await db.transaction(async (tx) => {
    for (const week of planData.planWeeks) {
      const [weekId] = await tx
        .insert(trainingWeeks)
        .values({
          totalVolumeMin: week.totalVolumeMin,
          userId,
          weekStart: formatDate(new Date(week.weekStart)),
          weekType: week.weekType,
          createdAt: new Date(),
        })
        .returning({ id: trainingWeeks.id });

      if (!weekId) throw new Error("Falha ao criar semana de treinamento");

      for (const workout of week.workouts) {
        const [workoutId] = await tx
          .insert(workouts)
          .values({
            userId: userId,
            trainingWeekId: weekId.id,
            scheduledStart: formatDate(workout.scheduledStart),
            title: workout.title,
            plannedDistanceM: workout.plannedDistanceM,
            plannedDurationS: workout.plannedDurationS,
            runType: workout.runType,
          })
          .returning({ id: workouts.id });

        if (!workoutId) throw new Error("Falha ao criar treino");

        if (!workout.blocks) continue;

        for (const block of workout.blocks) {
          const [blockId] = await tx
            .insert(blocks)
            .values({
              workoutId: workoutId.id,
              blockKind: block.blockKind,
              orderIndex: block.orderIndex,
              repeatCount: block.repeatCount,
              description: block.description,
            })
            .returning({ id: blocks.id });

          if (!blockId) throw new Error("Falha ao criar bloco");

          for (const segment of block.segments) {
            await tx.insert(segmentsTable).values({
              blockId: blockId.id,
              segmentKind: segment.segmentKind,
              plannedDistanceM: segment.plannedDistanceM,
              plannedDurationS: segment.plannedDurationS,
              targetPaceSPerKm: segment.targetPaceSPerKm,
              orderInBlock: segment.orderInBlock,
            });
          }
        }
      }
    }
  });
}
