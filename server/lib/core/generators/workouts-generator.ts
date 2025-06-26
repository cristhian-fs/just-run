import type { Training, TrainingLevel } from "@/shared/types";
import type { IntervalTemplate } from "@/lib/types";

import { generateFartlekWorkout } from "./workouts/fartleks";
import { generateIntervalWorkout } from "./workouts/intervals";
import { generateLongRun } from "./workouts/long-run";
import { generateProgressiveWorkout } from "./workouts/progressive";
import { generateThresholdWorkout } from "./workouts/thresholds";

export function generateWorkoutsPerWeek(
  trainings: Training[],
  totalVolumeMin: number,
  trainingLevel: TrainingLevel,
  vam: number,
) {
  const totalWeekVolume = totalVolumeMin;
  const totalIntensityVolume = totalWeekVolume * 0.3;

  const intenseTypes = ["INTERVAL", "FARTLEK", "TEMPO_RUN"];

  const intenseTrainings = trainings.filter((t) =>
    intenseTypes.includes(t.type),
  );

  const intensityPerTraining = totalIntensityVolume / intenseTrainings.length;

  return trainings.map((training) => {
    const isIntense = intenseTypes.includes(training.type);

    if (training.type === "INTERVAL") {
      const intervalWorkout: IntervalTemplate = generateIntervalWorkout({
        level: trainingLevel,
        targetKm: training.value,
        intensityKm: isIntense ? intensityPerTraining : 0,
        vam,
      });

      return { ...intervalWorkout, type: training.type, date: training.date };
    }

    if (training.type === "FARTLEK") {
      const fartlekWorkout = generateFartlekWorkout({
        level: trainingLevel,
        unit: "MINUTES",
        volume: training.value,
        intenseKms: isIntense ? intensityPerTraining : 0,
        vam,
      });
      return { ...fartlekWorkout, type: training.type, date: training.date };
    }

    if (training.type === "THRESHOLD_RUN") {
      const thresholdWorkout = generateThresholdWorkout({
        level: trainingLevel,
        volume: training.value,
        vo2Max: vam,
        unit: "MINUTES",
      });

      return {
        ...thresholdWorkout,
        type: training.type,
        date: training.date,
      };
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
        date: training.date,
        type: training.type,
        blocks: progressiveWorkout,
        level: trainingLevel,
        totalVolume: training.value,
      };
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
        type: training.type,
        date: training.date,
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
