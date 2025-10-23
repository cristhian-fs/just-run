import type {
	SessionVolumeDistribution,
	TTrainingType,
} from "@/shared/types/training.types";

import { getFartlekOrThresholdRun } from "./periodization";

// Distribuições de volume e sugestões de treino
export const trainingSugestionPerWeek: Record<number, TTrainingType[]> = {
	3: ["INTERVAL", getFartlekOrThresholdRun(), "LONG_RUN"],
	4: ["INTERVAL", "FARTLEK", "THRESHOLD_RUN", "LONG_RUN"],
	5: ["PROGRESSIVE_RUN", "INTERVAL", "FARTLEK", "THRESHOLD_RUN", "LONG_RUN"],
	6: [
		"INTERVAL",
		"PROGRESSIVE_RUN",
		"FARTLEK",
		"PROGRESSIVE_RUN",
		"THRESHOLD_RUN",
		"LONG_RUN",
	],
};

export const sessionVolumeDistribution: SessionVolumeDistribution = {
	3: {
		INTERVAL: 0.3,
		FARTLEK: 0.3,
		THRESHOLD_RUN: 0.3,
		LONG_RUN: 0.4,
	},
	4: {
		INTERVAL: 0.2,
		FARTLEK: 0.25,
		THRESHOLD_RUN: 0.2,
		LONG_RUN: 0.35,
	},
	5: {
		PROGRESSIVE_RUN: 0.2,
		INTERVAL: 0.15,
		FARTLEK: 0.2,
		THRESHOLD_RUN: 0.15,
		LONG_RUN: 0.3,
	},
	6: {
		INTERVAL: 0.13,
		PROGRESSIVE_RUN: 0.17, // 2x na semana
		FARTLEK: 0.16,
		THRESHOLD_RUN: 0.15,
		LONG_RUN: 0.22,
	},
};
