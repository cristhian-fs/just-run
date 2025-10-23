import type { trainingGoals } from "@/shared/constants/training.constants";
import type {
	TrainingGoal,
	TrainingGoalConfig,
} from "@/shared/types/training.types";

import type { GoalMapping } from "../types/training.types";

export const trainingGoalConfig: Record<TrainingGoal, TrainingGoalConfig> = {
	startRunning: {
		durationWeeks: 8,
		initialWeeklyMinutes: 60,
		peakWeeklyMinutes: 120,
		recommendedFrequency: 3,
		includeTaper: false,
		includeDeload: true,
		deloadEvery: 3,
		intensityProfile: "low",
		periodization: "linear",
	},
	improveHealth: {
		durationWeeks: 12,
		initialWeeklyMinutes: 90,
		peakWeeklyMinutes: 150,
		recommendedFrequency: 3,
		includeTaper: false,
		includeDeload: true,
		deloadEvery: 4,
		intensityProfile: "moderate",
		periodization: "linear",
	},
	loseWeight: {
		durationWeeks: 12,
		initialWeeklyMinutes: 100,
		peakWeeklyMinutes: 180,
		recommendedFrequency: 4,
		includeTaper: false,
		includeDeload: true,
		deloadEvery: 4,
		intensityProfile: "moderate",
		periodization: "undulating",
	},
	runFaster: {
		durationWeeks: 10,
		initialWeeklyMinutes: 120,
		peakWeeklyMinutes: 180,
		recommendedFrequency: 4,
		includeTaper: true,
		includeDeload: true,
		deloadEvery: 4,
		intensityProfile: "high",
		periodization: "polarized",
	},
	runLonger: {
		durationWeeks: 12,
		initialWeeklyMinutes: 120,
		peakWeeklyMinutes: 200,
		recommendedFrequency: 4,
		includeTaper: true,
		includeDeload: true,
		deloadEvery: 4,
		intensityProfile: "moderate",
		periodization: "linear",
	},
	race5K: {
		durationWeeks: 8,
		initialWeeklyMinutes: 120,
		peakWeeklyMinutes: 180,
		recommendedFrequency: 4,
		includeTaper: true,
		includeDeload: true,
		deloadEvery: 3,
		intensityProfile: "high",
		periodization: "polarized",
	},
	race10K: {
		durationWeeks: 10,
		initialWeeklyMinutes: 150,
		peakWeeklyMinutes: 210,
		recommendedFrequency: 4,
		includeTaper: true,
		includeDeload: true,
		deloadEvery: 4,
		intensityProfile: "high",
		periodization: "linear",
	},
	race21K: {
		durationWeeks: 12,
		initialWeeklyMinutes: 180,
		peakWeeklyMinutes: 260,
		recommendedFrequency: 5,
		includeTaper: true,
		includeDeload: true,
		deloadEvery: 4,
		intensityProfile: "high",
		periodization: "linear",
	},
	race42K: {
		durationWeeks: 16,
		initialWeeklyMinutes: 220,
		peakWeeklyMinutes: 360,
		recommendedFrequency: 5,
		includeTaper: true,
		includeDeload: true,
		deloadEvery: 3,
		intensityProfile: "moderate",
		periodization: "linear",
	},
};

export const goalToRacePlan: Partial<
	Record<(typeof trainingGoals)[number], GoalMapping>
> = {
	race5K: { race: "5K", weeklyKm: 25 }, // 3~4 treinos/semana
	race10K: { race: "10K", weeklyKm: 40 }, // 4 treinos/semana
	race21K: { race: "21K", weeklyKm: 60 }, // 4~5 treinos/semana
	race42K: { race: "42K", weeklyKm: 80 }, // 5~6 treinos/semana
};

export const defaultWeeklyMinutesByGoal: Record<
	(typeof trainingGoals)[number],
	number
> = {
	startRunning: 90,
	improveHealth: 120,
	loseWeight: 150,
	runFaster: 200,
	runLonger: 240,
	race5K: 200,
	race10K: 240,
	race21K: 300,
	race42K: 420,
};
