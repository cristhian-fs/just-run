import type { TrainingLevel, Week } from "@/shared/types";
import type { ProgressiveWorkout } from "@/lib/types";

import { generateFartlekWorkout } from "./workouts/fartleks";
import { generateIntervalWorkout } from "./workouts/intervals";
import { generateLongRun } from "./workouts/long-run";
import { generateProgressiveWorkout } from "./workouts/progressive";
import { generateThresholdWorkout } from "./workouts/thresholds";

export function generateWorkoutsPerWeek(
  week: Week,
  trainingLevel: TrainingLevel,
  vam: number,
) {
  const totalWeekVolume = week.value;
  const totalIntensityVolume = totalWeekVolume * 0.2;

  const intenseTypes = ["INTERVAL", "FARTLEK", "TEMPO_RUN"];

  const intenseTrainings = week.trainings.filter((t) =>
    intenseTypes.includes(t.type),
  );

  const intensityPerTraining = totalIntensityVolume / intenseTrainings.length;

  return week.trainings.map((training) => {
    const isIntense = intenseTypes.includes(training.type);

    if (training.type === "INTERVAL") {
      const intervalWorkout = generateIntervalWorkout({
        level: trainingLevel,
        targetKm: training.value,
        intensityKm: isIntense ? intensityPerTraining : 0,
        vam,
      });

      return intervalWorkout;
    }

    if (training.type === "FARTLEK") {
      const fartlekWorkout = generateFartlekWorkout({
        level: trainingLevel,
        unit: "MINUTES",
        volume: training.value,
        intenseKms: isIntense ? intensityPerTraining : 0,
        vam,
      });
      return fartlekWorkout;
    }

    if (training.type === "THRESHOLD_RUN") {
      const thresholdWorkout = generateThresholdWorkout({
        level: trainingLevel,
        volume: training.value,
        vo2Max: vam,
        unit: "MINUTES",
      });

      return thresholdWorkout;
    }

    if (training.type === "PROGRESSIVE_RUN") {
      const progressiveWorkout = generateProgressiveWorkout({
        level: trainingLevel,
        unit: "KM",
        vam,
        volume: training.value,
      });

      return {
        name: `Treino progressivo ${training.value}km`,
        blocks: progressiveWorkout,
        level: trainingLevel,
        totalVolume: training.value,
      } as ProgressiveWorkout;
    }

    if (
      training.type === "LONG_RUN" ||
      training.type === "EASY_RUN" ||
      training.type === "RECOVERY_RUN"
    ) {
      const longRunWorkout = generateLongRun({
        level: trainingLevel,
        vam,
        volumeKm: training.value,
        includeProgression: false,
      });
      return {
        name: `Treino longo ${training.value}km`,
        blocks: longRunWorkout,
        level: trainingLevel,
        totalVolume: training.value,
      };
    }

    // Para tipos não intensos, você pode retornar direto:
    return {
      type: training.type,
      value: training.value,
      note: "Treino leve ou sem estrutura complexa",
    };
  });
}
