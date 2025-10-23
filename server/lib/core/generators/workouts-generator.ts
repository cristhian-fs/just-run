import type { Test, Training, TrainingLevel, Workout } from "@/shared/types";

import { generateFartlekWorkout } from "./workouts/fartleks";
import { generateIntervalWorkout } from "./workouts/intervals";
import { generateBaseRun } from "./workouts/long-run";
import { generateProgressiveWorkout } from "./workouts/progressive";
import { generateThresholdRun } from "./workouts/thresholds";

export function generateWorkoutsPerWeek(
	trainings: Training[],
	totalVolumeMin: number,
	trainingLevel: TrainingLevel,
	vam: number,
	testData: Test,
): Workout[] {
	const totalWeekVolume = totalVolumeMin;
	const totalIntensityVolume = totalWeekVolume * 0.5;

	const intenseTypes = ["INTERVAL", "FARTLEK", "TEMPO_RUN"];

	const intenseTrainings = trainings.filter((t) =>
		intenseTypes.includes(t.type),
	);

	const intensityPerTraining = totalIntensityVolume / intenseTrainings.length;

	return trainings.map((training) => {
		const isIntense = intenseTypes.includes(training.type);

		if (training.type === "INTERVAL") {
			const intervalWorkout: Workout = generateIntervalWorkout({
				level: trainingLevel,
				targetVolume: training.value,
				intensityKm: isIntense ? intensityPerTraining : 0,
				vam,
				date: training.date,
			});

			return intervalWorkout;
		}

		if (training.type === "FARTLEK") {
			const fartlekWorkout: Workout = generateFartlekWorkout({
				level: trainingLevel,
				vam,
				lastUserTestData: testData,
				date: training.date,
			});
			return fartlekWorkout;
		}

		if (training.type === "THRESHOLD_RUN") {
			const thresholdWorkout = generateThresholdRun({
				date: training.date,
				level: trainingLevel,
				targetVolume: training.value,
				vam: vam,
				unit: trainingLevel === "beginner" ? "MINUTES" : "KM",
			});

			return thresholdWorkout;
		}

		if (training.type === "PROGRESSIVE_RUN") {
			const progressiveWorkout = generateProgressiveWorkout({
				level: trainingLevel,
				unit: "KM",
				vam,
				targetVolume: training.value,
				date: training.date,
			});

			return progressiveWorkout;
		}

		if (
			training.type === "LONG_RUN" ||
			training.type === "EASY_RUN" ||
			training.type === "RECOVERY_RUN"
		) {
			const longRunWorkout = generateBaseRun({
				level: trainingLevel,
				vam,
				targetVolume: training.value,
				date: training.date,
				runType: training.type,
				unit: trainingLevel === "beginner" ? "MINUTES" : "KM",
			});
			return longRunWorkout;
		}

		return {
			runType: "EASY_RUN",
			title: "Sem treino",
			scheduledStart: training.date,
			blocks: [],
			segments: [],
		};
	});
}
