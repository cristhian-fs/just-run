import type {
  RaceOption,
  TTrainingType,
  TWeekType,
  WeekAmount,
} from "@/shared/types/training.types";
import {
  getPeriodizationByRaceType,
  MONTH_VOLUME_BY_PERIODIZATION,
  weekPatternsByDuration,
} from "@/lib/config/periodization";
import {
  sessionVolumeDistribution,
  trainingSugestionPerWeek,
} from "@/lib/config/training-distributions";
import type { WeeklyKmTrainingDistribution } from "@/lib/types/training.types";

// Função pra obter os meses de treino com base na opção da corrida, os kms por semana e a quantidade de semanas
export function getMonthVolumesByRace(
  race: RaceOption,
  kmByWeek: number,
  weeks: number,
) {
  const macroCycleKms = weeks * kmByWeek;
  const periodization = getPeriodizationByRaceType(race);
  const periodVolumes = MONTH_VOLUME_BY_PERIODIZATION[periodization];

  const totalMonths = Math.floor(weeks / 4);
  const monthsToUse = periodVolumes.slice(0, totalMonths);

  const totalPercentage = monthsToUse.reduce(
    (sum, m) => sum + m.monthVolumePercentage,
    0,
  );

  const kmPerPercentage = macroCycleKms / totalPercentage;

  return monthsToUse.map(({ monthIndex, monthVolumePercentage }) => {
    const monthKm = monthVolumePercentage * kmPerPercentage;

    return {
      monthIndex,
      monthVolumePercentage,
      monthKm: parseFloat(monthKm.toFixed(2)),
    };
  });
}

// Função para obter os meses de treino com base na opção de corrida, alterando o retorno para minutos e não kms
export function getMonthMinutesByRace(
  race: RaceOption,
  minByWeek: number,
  weeks: number,
) {
  const macroCycleMinutes = weeks * minByWeek;
  const periodization = getPeriodizationByRaceType(race);
  const periodVolumes = MONTH_VOLUME_BY_PERIODIZATION[periodization];

  const totalMonths = Math.floor(weeks / 4);
  const monthsToUse = periodVolumes.slice(0, totalMonths);

  const totalPercentage = monthsToUse.reduce(
    (sum, month) => sum + month.monthVolumePercentage,
    0,
  );

  const minPerPercentage = macroCycleMinutes / totalPercentage;

  return monthsToUse.map(({ monthIndex, monthVolumePercentage }) => {
    const monthMinutes = monthVolumePercentage * minPerPercentage;

    return {
      monthIndex,
      monthVolumePercentage,
      monthMinutes: parseFloat(monthMinutes.toFixed(2)),
    };
  });
}

/**
 * Distribui os kms a serem corridos em cada semana da periodização
 * @param weeks Quantas semanas tem a periodização do usuário
 * @param race Qual a prova alvo do usuário
 * @param kmByWeek Quantos kilometros de base serão corridos por semana inicialmente
 * @returns Um array com o tipo de semana, quantos kms a serem corridos na semana e os volume de cada treino para essa semana
 */
export function distributeWeeklyVolumes(
  weeks: WeekAmount,
  race: RaceOption,
  baseValuePerWeek: number,
  weeklyFrequency: number,
  unit: "KM" | "MINUTES",
): WeeklyKmTrainingDistribution[] {
  const trainingWeeks = weekPatternsByDuration[weeks];

  // Seleciona a função de volume mensal conforme a unidade
  const monthlyVolumeData =
    unit === "KM"
      ? getMonthVolumesByRace(race, baseValuePerWeek, weeks).map(
          ({ monthIndex, monthVolumePercentage, monthKm }) => ({
            monthIndex,
            monthVolumePercentage,
            value: monthKm,
          }),
        )
      : getMonthMinutesByRace(race, baseValuePerWeek, weeks).map(
          ({ monthIndex, monthVolumePercentage, monthMinutes }) => ({
            monthIndex,
            monthVolumePercentage,
            value: monthMinutes,
          }),
        );

  return trainingWeeks.map((weekType, weekIndex) => {
    const monthIndex = Math.floor(weekIndex / 4);
    const month = monthlyVolumeData.find((m) => m.monthIndex === monthIndex);

    if (!month) return { weekType, value: 0, trainings: [] };

    const weeklyValue = getPhaseVolume(weekType, month.value);

    const trainingTypes = trainingSugestionPerWeek[weeklyFrequency] ?? [];
    const volumeDistribution = sessionVolumeDistribution[weeklyFrequency] ?? {};

    const trainingVolumes = applyVolumeDistribution(
      volumeDistribution,
      weeklyValue,
    );

    const trainings = trainingTypes.map((type) => ({
      type,
      value: trainingVolumes[type],
    }));

    return {
      weekType,
      value: parseFloat(weeklyValue.toFixed(2)),
      trainings,
    };
  });
}

export function distributeWeeklyKmVolumes(
  weeks: WeekAmount,
  race: RaceOption,
  kmByWeek: number,
  weeklyFrequency: number,
) {
  return distributeWeeklyVolumes(weeks, race, kmByWeek, weeklyFrequency, "KM");
}

export function distributeWeeklyMinVolumes(
  weeks: WeekAmount,
  race: RaceOption,
  minByWeek: number,
  weeklyFrequency: number,
) {
  return distributeWeeklyVolumes(
    weeks,
    race,
    minByWeek,
    weeklyFrequency,
    "MINUTES",
  );
}

export function getPhaseVolume(phase: TWeekType, baseValue: number): number {
  const percentageByPhase: Record<TWeekType, number> = {
    INTRO: 0.24,
    TEST: 0.26,
    BUILD: 0.26,
    BASE: 0.25,
    TAPER: 0.27,
    DELOAD: 0.23,
    PEAK: 0.23,
    COMPETITION: 0.22,
  };

  const percentage = percentageByPhase[phase];
  return percentage !== undefined ? baseValue * percentage : 0;
}

export function applyVolumeDistribution(
  distribution: Partial<Record<TTrainingType, number>>,
  weeklyKm: number,
): Record<TTrainingType, number> {
  const allTypes: TTrainingType[] = [
    "EASY_RUN",
    "LONG_RUN",
    "INTERVAL",
    "FARTLEK",
    "PROGRESSIVE_RUN",
    "REPETITION",
    "RECOVERY_RUN",
    "THRESHOLD_RUN",
  ];

  return allTypes.reduce(
    (acc, type) => {
      const percent = distribution[type] ?? 0;
      acc[type] = parseFloat((percent * weeklyKm).toFixed(2));
      return acc;
    },
    {} as Record<TTrainingType, number>,
  );
}
