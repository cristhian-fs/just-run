import type { TrainingUnit } from "@/lib/types";
import type { Block, TrainingLevel, Workout } from "@/shared/types";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

type BaseRunType = "EASY_RUN" | "LONG_RUN" | "RECOVERY_RUN";

interface BaseRunInput {
	runType: BaseRunType;
	date: Date;
	vam: number; // km/h
	level: TrainingLevel;
	unit: TrainingUnit;
	targetVolume: number; // km ou min
}

export function generateBaseRun({
	runType,
	date,
	level,
	targetVolume,
	vam,
	unit,
}: BaseRunInput): Workout {
	/* --- 1. Zonas alvo por tipo ---  */
	const ZONES: Record<BaseRunType, number[]> = {
		EASY_RUN: [0.65, 0.75] as const,
		RECOVERY_RUN: [0.6, 0.68] as const,
		LONG_RUN: [0.65, 0.78] as const,
	};

	/* ---  2. Fatias de WU/CO ---  */
	const FRAC_WU = 0.12; // 12% de WU
	const FRAC_CO = 0.08; // 8% de CO

	const totalBase = unit === "KM" ? targetVolume * 1_000 : targetVolume * 60;
	const warmup = Math.round(totalBase * FRAC_WU);
	const cooldown = Math.round(totalBase * FRAC_CO);
	let mainPart = totalBase - warmup - cooldown;

	/* --- 3. ritmo alvo --- */
	const [lowZ, highZ] = ZONES[runType] as [number, number];
	const vWork =
		vam *
		(runType === "LONG_RUN" && level === "advanced"
			? highZ
			: (lowZ + highZ) / 2);
	const vEasyLow = vam * lowZ;
	const paceWork = Math.round(3600 / vWork);
	const paceEasy = Math.round(3600 / vEasyLow);

	const blocks: Block[] = [];

	/* --- 4. WARM‑UP --- */
	blocks.push({
		blockKind: "WARMUP",
		repeatCount: 1,
		orderIndex: 1,
		description: `Aquecimento | pace ${formatPace(getPace(vEasyLow))}`,
		segments: [
			unit === "KM"
				? {
						segmentKind: "WARMUP",
						orderInBlock: 1,
						plannedDistanceM: warmup,
						targetPaceSPerKm: paceEasy,
					}
				: {
						segmentKind: "WARMUP",
						orderInBlock: 1,
						plannedDurationS: warmup,
						targetPaceSPerKm: paceEasy,
					},
		],
	});

	/* --- 5. LONG RUN - "finish fast" opcional */
	if (runType === "LONG_RUN" && level === "advanced") {
		const fastPart = mainPart * 0.2;
		mainPart -= fastPart;

		blocks.push({
			blockKind: "WORK",
			repeatCount: 1,
			orderIndex: 2,
			description: `Parte contínua fácil | pace ${formatPace(getPace(vEasyLow))}`,
			segments: [
				unit === "KM"
					? {
							segmentKind: "WORK",
							orderInBlock: 1,
							plannedDistanceM: mainPart,
							targetPaceSPerKm: vEasyLow,
						}
					: {
							segmentKind: "WORK",
							orderInBlock: 1,
							plannedDurationS: mainPart,
							targetPaceSPerKm: vEasyLow,
						},
			],
		});

		// mini‑bloco progressivo
		blocks.push({
			blockKind: "WORK",
			repeatCount: 1,
			orderIndex: 3,
			description: `Final forte | pace ${formatPace(getPace(vWork))}`,
			segments: [
				unit === "KM"
					? {
							segmentKind: "WORK",
							orderInBlock: 1,
							plannedDistanceM: fastPart,
							targetPaceSPerKm: paceWork,
						}
					: {
							segmentKind: "WORK",
							orderInBlock: 1,
							plannedDurationS: fastPart,
							targetPaceSPerKm: paceWork,
						},
			],
		});
	} else {
		/* --- 5. RUN contínuo EASY / RECOVERY --- */
		blocks.push({
			blockKind: "WORK",
			repeatCount: 1,
			orderIndex: 2,
			description: `Parte contínua | pace ${formatPace(getPace(vWork))}`,
			segments: [
				unit === "KM"
					? {
							segmentKind: "WORK",
							orderInBlock: 1,
							plannedDistanceM: mainPart,
							targetPaceSPerKm: paceWork,
						}
					: {
							segmentKind: "WORK",
							orderInBlock: 1,
							plannedDurationS: mainPart,
							targetPaceSPerKm: paceWork,
						},
			],
		});
	}

	/* --- 6. COOL‑DOWN --- */
	blocks.push({
		blockKind: "COOLDOWN",
		repeatCount: 1,
		orderIndex: blocks.length + 1,
		description: `Desaquecimento | pace ${formatPace(getPace(vEasyLow))}`,
		segments: [
			unit === "KM"
				? {
						segmentKind: "COOLDOWN",
						orderInBlock: 1,
						plannedDistanceM: cooldown,
						targetPaceSPerKm: paceEasy,
					}
				: {
						segmentKind: "COOLDOWN",
						orderInBlock: 1,
						plannedDurationS: cooldown,
						targetPaceSPerKm: paceEasy,
					},
		],
	});

	/* --- 7. Retorno final --- */
	const common = {
		runType,
		scheduledStart: date,
		title: `Corrida longa - ${unit === "KM" ? targetVolume + " km" : targetVolume + " min"}.`,
		blocks,
		notes:
			`${runType} de ${unit === "KM" ? targetVolume + " km" : targetVolume + " min"}. ` +
			`Ritmo alvo ${formatPace(paceWork)}.`,
	};

	return unit === "KM"
		? { ...common, plannedDistanceM: Math.round(targetVolume * 1_000) }
		: { ...common, plannedDurationS: Math.round(targetVolume * 60) };
}
