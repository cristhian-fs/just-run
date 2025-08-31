import { getAerobicHeartRace } from "../calculations/heart-rate";

export enum HeartRaceZone {
	Recovery = "Recovery",
	Easy = "Easy Aerobic Zone",
	ModAero = "Moderate Aerobic",
	HiAero = "High Aerobic",
	Marathon = "Marathon",
	HalfMarathon = "Half Marathon",
	Race15k = "15k",
	Race12k = "12k",
	Race10k = "10k",
	Race8k = "8k",
	Race5k = "5k",
	Race3k = "3k",
	Race1Mile = "1 Mile",
}

type HeartRaceZoneHRRParams = {
	marathonHr: number;
	easyMaxHr: number;
};

export const HeartRateZoneHRR: ({
	marathonHr,
	easyMaxHr,
}: HeartRaceZoneHRRParams) => Partial<
	Record<HeartRaceZone, { min?: number; max: number }>
> = ({ easyMaxHr, marathonHr }: HeartRaceZoneHRRParams) => ({
	[HeartRaceZone.Recovery]: { max: 50 },
	[HeartRaceZone.Easy]: { min: 67, max: 70 },
	[HeartRaceZone.ModAero]: {
		max: getAerobicHeartRace({
			marathonHr: marathonHr,
			easyMaxHr,
			type: "moderate",
		}),
	},
	[HeartRaceZone.HiAero]: {
		max: getAerobicHeartRace({
			marathonHr,
			easyMaxHr,
			type: "high",
		}),
	},
});

export const MAPPED_RACE_MILES_DISTANCE: Partial<
	Record<HeartRaceZone, number>
> = {
	Marathon: 26.21876,
	"Half Marathon": 13.10938,
	"15k": 9.32057,
	"12k": 7.45645,
	"10k": 6.21371,
	"8k": 4.97097,
	"5k": 3.10686,
	"3k": 1.86411,
	"1 Mile": 1,
};
export const MAPPED_RACE_METERS_DISTANCE: Partial<
	Record<HeartRaceZone, number>
> = {
	Marathon: 42_195,
	"Half Marathon": 21_097.5,
	"15k": 15_000,
	"12k": 12_000,
	"10k": 10_000,
	"8k": 8_000,
	"5k": 5_000,
	"3k": 3_000,
	"1 Mile": 1_609.34,
};

export const RACE_DISTANCE_KEYS = [
	HeartRaceZone.Marathon,
	HeartRaceZone.HalfMarathon,
	HeartRaceZone.Race15k,
	HeartRaceZone.Race12k,
	HeartRaceZone.Race10k,
	HeartRaceZone.Race8k,
	HeartRaceZone.Race5k,
	HeartRaceZone.Race3k,
	HeartRaceZone.Race1Mile,
] as const;

export type RaceDistanceKey = (typeof RACE_DISTANCE_KEYS)[number];

export type RaceTime = {
	race: RaceDistanceKey;
	pace: string;
	time: number;
};

export type SegmentPace = {
	name: string;
	paceInterval: string;
};

export const TEST_DISTANCE_MAPPING: Record<RaceDistanceKey, string> = {
	"1 Mile": "1 milha",
	"3k": "3km",
	"5k": "5km",
	"8k": "8km",
	"10k": "10km",
	"12k": "12km",
	"15k": "15km",
	"Half Marathon": "Meia maratona",
	Marathon: "Maratona",
};

export const vdotTrainingSegmentTypes = [
	"THRESHOLD",
	"INTERVAL",
	"REPETITION",
] as const;

export type VDOTTrainingSegmentType = (typeof vdotTrainingSegmentTypes)[number];

export const VDOTTrainingSegmentTypeMapping: Record<
	VDOTTrainingSegmentType,
	string
> = {
	THRESHOLD: "Limiar",
	INTERVAL: "Intervalo",
	REPETITION: "Repetição",
};

export const heartRaceZoneMapping: Partial<Record<HeartRaceZone, string>> = {
	Recovery: "Regenerativo",
	"Easy Aerobic Zone": "Corrida fácil",
	"Moderate Aerobic": "Zona aeróbica moderada",
	"High Aerobic": "Zona aeróbica alta",
	"1 Mile": "1 milha",
	"10k": "10km",
	"12k": "12km",
	"15k": "15km",
	"3k": "3km",
	"5k": "5km",
	"8k": "8km",
	"Half Marathon": "Meia maratona",
	Marathon: "Maratona",
};

export const TRAINING_DISTANCES = [
	{ distance: "200m", multiplier: 0.2 },
	{ distance: "300m", multiplier: 0.3 },
	{ distance: "400m", multiplier: 0.4 },
	{ distance: "600m", multiplier: 0.6 },
	{ distance: "800m", multiplier: 0.8 },
	{ distance: "1200m", multiplier: 1.2 },
	{ distance: "1600m", multiplier: 1.6 },
];

export type VDOTSegmentPaces = {
	[K in VDOTTrainingSegmentType]: { pace: string; distance: string }[];
};

export type TrainingSegmentPaces = VDOTSegmentPaces & {
	defaults: Partial<
		Record<HeartRaceZone | VDOTTrainingSegmentType, { paceKm: string }>
	>;
};

export const zonesFallback: TrainingSegmentPaces = {
	INTERVAL: TRAINING_DISTANCES.map(() => ({ pace: "00:00", distance: "0m" })),
	THRESHOLD: TRAINING_DISTANCES.map(() => ({ pace: "00:00", distance: "0m" })),
	REPETITION: TRAINING_DISTANCES.map(() => ({ pace: "00:00", distance: "0m" })),
	defaults: {
		"Easy Aerobic Zone": {
			paceKm: "00:00",
		},
		Marathon: {
			paceKm: "00:00",
		},
		THRESHOLD: {
			paceKm: "00:00",
		},
		INTERVAL: {
			paceKm: "00:00",
		},
		REPETITION: {
			paceKm: "00:00",
		},
	},
};

export const raceTimesFallback: RaceTime[] = RACE_DISTANCE_KEYS.map((key) => ({
	race: key,
	pace: "00:00",
	time: 0,
}));
