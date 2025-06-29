import { addDays, nextMonday } from "date-fns";

import type {
  RaceOption,
  Test,
  Training,
  TrainingLevel,
  TTrainingType,
  WeekAmount,
} from "@/shared/types";
import { WEEKLY_TEMPLATES } from "@/lib/config/workouts.contants";

import { distributeWeeklyVolumes } from "./periodization-generator";
import { generateWorkoutsPerWeek } from "./workouts-generator";

function distributeTrainingsInWeek(
  trainings: Array<{ type: TTrainingType; value: number }>,
  weekStartDate: Date,
  weeklyFrequency: number,
): Training[] {
  const template =
    WEEKLY_TEMPLATES[weeklyFrequency as keyof typeof WEEKLY_TEMPLATES];
  if (!template) {
    throw new Error(
      `Template não encontrado para ${weeklyFrequency} treinos por semana}`,
    );
  }

  const startDayOfWeek = weekStartDate.getDay();
  const daysRemainingInWeek = 7 - startDayOfWeek;

  // Se começou muito tarde na semana(quinta, sexta, sábado), ajustar quantidade
  // const adjustedTrainings = adjustTrainingsForLateStart(
  //   trainings,
  //   startDayOfWeek,
  //   daysRemainingInWeek,
  // );

  const isLateStart = startDayOfWeek >= 4; // qui = 4, sex = 5, sáb = 6
  const maxTrainings = isLateStart
    ? daysRemainingInWeek // cabe só o que resta
    : trainings.length; // usa todos

  const adjustedTrainings = trainings.slice(0, maxTrainings);

  // Mapeia treinos para os melhores dias disponíveis
  const trainingDays: Training[] = [];

  template.pattern.forEach((dayTemplate, index) => {
    // Pular treinos da semana que não cabem na semana atual
    if (index >= adjustedTrainings.length) return;

    const training = adjustedTrainings[index];

    if (!training) return;

    // Novo cálculo do deslocamento
    const offset = (dayTemplate.day - startDayOfWeek + 7) % 7;
    const trainingDate = addDays(weekStartDate, offset); // date-fns

    trainingDays.push({
      date: trainingDate,
      type: training.type as TTrainingType,
      value: training.value,
    });
  });

  return trainingDays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Versão melhorada da função original incluindo distribuição por dias
 */
export function distributeWeeklyVolumesWithDays(
  weeks: WeekAmount,
  race: RaceOption,
  baseValuePerWeek: number,
  weeklyFrequency: number,
  unit: "KM" | "MINUTES",
  startDate: Date,
  trainingLevel: TrainingLevel,
  vam: number,
  testData: Test,
) {
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

    const trainingDays = distributeTrainingsInWeek(
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
