import { addDays, nextMonday } from "date-fns";

import type {
  RaceOption,
  Test,
  Training,
  TrainingLevel,
  TTrainingType,
  WeekAmount,
} from "@/shared/types";

import { distributeWeeklyVolumes } from "./periodization-generator";
import { generateWorkoutsPerWeek } from "./workouts-generator";

interface TrainingInput {
  type: TTrainingType;
  value: number;
}

// Versão alternativa com algoritmo de distribuição dinâmica
function distributeTrainingsInWeekDynamic(
  trainings: TrainingInput[],
  weekStartDate: Date,
  weeklyFrequency: number,
): Training[] {
  if (!trainings.length) return [];

  const startDay = weekStartDate.getDay(); // 0=dom … 6=sáb
  const daysLeft = 7 - startDay; // quantos dias até domingo

  /* ------ dias preferidos por frequência ------ */
  const preferredDays = (() => {
    switch (weeklyFrequency) {
      case 3:
        return [1, 3, 6]; // seg, qua, sáb
      case 4:
        return [1, 3, 5, 0]; // seg, qua, sex, dom
      case 5:
        return [1, 2, 4, 5, 0]; // seg, ter, qui, sex, dom
      case 6:
        return [1, 2, 3, 4, 5, 0]; // seg…sex, dom
      default:
        return [1, 3, 5]; // fallback
    }
  })();

  /* ------ calcula offsets e descarta o que passa do domingo ------ */
  const availableDays = preferredDays
    .map((day) => {
      const offset = (day - startDay + 7) % 7; // 0…6 dias à frente
      return { day, offset };
    })
    .filter((d) => d.offset <= daysLeft) // <= domingo
    .sort((a, b) => a.offset - b.offset); // ordem cronológica

  /* ------ corta a lista de treinos ao nº de dias realmente livre ------ */
  const maxTrainings = Math.min(trainings.length, availableDays.length);
  const selected = trainings.slice(0, maxTrainings);

  /* ------ monta resultado ------ */
  return selected.map((t, i) => {
    const { offset } = availableDays[i] || { offset: 0 };
    return {
      date: addDays(weekStartDate, offset),
      type: t.type,
      value: t.value,
    };
  });
}

/**
 * Versão melhorada da função original incluindo distribuição por dias
 */
export function distributeWeeklyVolumesWithDays({
  weeks,
  baseValuePerWeek,
  race,
  startDate,
  testData,
  trainingLevel,
  unit,
  vam,
  weeklyFrequency,
}: {
  weeks: WeekAmount;
  race: RaceOption;
  baseValuePerWeek: number;
  weeklyFrequency: number;
  unit: "KM" | "MINUTES";
  startDate: Date;
  trainingLevel: TrainingLevel;
  vam: number;
  testData: Test;
}) {
  const basicDistribution = distributeWeeklyVolumes(
    weeks,
    race,
    baseValuePerWeek,
    weeklyFrequency,
    unit,
  );

  return basicDistribution.map((week, weekIndex) => {
    const weekStartDate =
      weekIndex === 0
        ? startDate
        : nextMonday(addDays(startDate, (weekIndex - 1) * 7));

    const trainingDays = distributeTrainingsInWeekDynamic(
      week.trainings,
      weekStartDate,
      weeklyFrequency,
    );

    const workouts = generateWorkoutsPerWeek(
      trainingDays,
      week.totalVolumeMin,
      trainingLevel,
      vam,
      testData,
    );

    return {
      week,
      weekStart: weekStartDate,
      trainingDays,
      workouts,
    };
  });
}
