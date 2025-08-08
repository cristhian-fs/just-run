import type { TrainingUnit } from "@/lib/types";
import type { Block, TrainingLevel, Workout } from "@/shared/types";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

// CONSTANTS
const FLOAT_REST_INTERMEDIATE_RELATION = 1.2;
const MAX_ATTEMPTS = 10;

function isValidInterval({
	unit,
	reps,
	repLength,
	level,
}: {
	unit: TrainingUnit;
	reps: number;
	repLength?: number;
	level: TrainingLevel;
}) {
	if (unit === "KM") {
		if (!repLength) return false;
		if (reps < 3 || reps > 20) return false;
		if (level === "intermediate" && repLength > 1000) return false;
	}

	if (unit === "MINUTES") {
		if (reps < 3 || reps > 12) return false;
	}

	return true;
}

function getRandomIntervalDistance(
	trainingLevel: TrainingLevel,
	mainPart: number,
	vam: number,
): [number, number] {
	const meterOptionsByVolume: Record<number, Array<number>> = {
		5: [100, 200, 300, 400, 500],
		10: [100, 200, 300, 400, 500, 600, 800, 1000],
		15: [
			100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 1600, 2000, 3000,
			5000,
		],
	};

	if (trainingLevel !== "beginner") {
		// Pega as chaves do objeto e ordena em ordem crescente
		const volumeKeys = Object.keys(meterOptionsByVolume)
			.map(Number)
			.sort((a, b) => a - b);

		// Encontra a chave apropriada baseada no volume
		let selectedKey = volumeKeys[volumeKeys.length - 1]; // Default para a maior chave

		for (const key of volumeKeys) {
			if (mainPart <= key) {
				selectedKey = key;
				break;
			}
		}
		// Retorna um valor aleatório do array da chave selecionada
		const options = meterOptionsByVolume[selectedKey as number] as number[];
		const distance = options[
			Math.floor(Math.random() * options.length)
		] as number;

		const durationS = distance / ((vam * 1000) / 3600);

		const tMin = durationS / 60; // minutos estimados do tiro
		const pShort = 1.05; // 105 % VAM no “tiro curtinho”
		const vamFraction = Math.max(0.88, pShort - 0.02 * tMin); // –2 pp por minuto
		return [distance, vamFraction];
	}

	const secondsOptions = Array.from({ length: 10 }).map((_, i) => 30 * (i + 1));
	const durationS = secondsOptions[
		Math.floor(Math.random() * secondsOptions.length)
	] as number;

	const tMin = durationS / 60; // minutos estimados do tiro
	const pShort = 1.05; // 105 % VAM no “tiro curtinho”
	const vamFraction = Math.max(0.88, pShort - 0.02 * tMin); // –2 pp por minuto

	return [durationS, vamFraction];
}

export function generateIntervalWorkout({
	date,
	level = "intermediate",
	targetVolume,
	intensityKm,
	vam = 14, // Velocidade aeróbica máxima em km/h
}: {
	date: Date;
	level: TrainingLevel;
	targetVolume: number;
	intensityKm: number;
	vam?: number;
}): Workout {
	let attempts = 0;

	if (level !== "beginner") {
		const volumeToMeters = targetVolume * 1000;
		const warmup = Math.round(volumeToMeters * 0.15);
		const cooldown = Math.round(volumeToMeters * 0.1);
		const mainPart = Math.floor(volumeToMeters - warmup - cooldown);

		const [intervalDuration, vamForInterval] = getRandomIntervalDistance(
			level,
			mainPart,
			vam,
		);
		const numReps = Math.floor(mainPart / intervalDuration);

		if (
			!isValidInterval({
				unit: "KM",
				reps: numReps,
				level,
				repLength: intervalDuration,
			})
		) {
			attempts++;

			if (attempts >= MAX_ATTEMPTS) {
				throw new Error("Could not generate a valid interval workout.");
			}
			return generateIntervalWorkout({
				date,
				level,
				targetVolume,
				intensityKm,
				vam,
			});
		}

		const blocks: Block[] = [];
		const warmupVelocity = vam * 0.65;
		const warmupPace = formatPace(getPace(warmupVelocity));
		const pace = formatPace(getPace(vamForInterval * vam));

		const durationS = Math.floor(intervalDuration / ((vam * 1000) / 3600));
		const isShort = durationS <= 90; // Default para 90 segundos em tiro curto

		const useFloat =
			(level === "intermediate" && isShort) ||
			(level === "advanced" && isShort && numReps > 8);

		blocks.push({
			blockKind: "WARMUP",
			repeatCount: 1,
			orderIndex: 1,
			description: `Aquecimento leve | Pace ${warmupPace}`,
			segments: [
				{
					plannedDistanceM: warmup,
					orderInBlock: 1,
					segmentKind: "WARMUP",
					targetPaceSPerKm: Math.round(3600 / warmupVelocity),
				},
			],
		});
		blocks.push({
			blockKind: "WORK",
			repeatCount: numReps,
			orderIndex: 2,
			description: `${numReps} x ${intervalDuration}m @ ${Math.floor(vamForInterval * 100)}% Vam | pace ${pace}`,
			segments: [
				{
					plannedDistanceM: intervalDuration,
					orderInBlock: 1,
					segmentKind: "WORK",
					targetPaceSPerKm: Math.round(3600 / (vamForInterval * vam)),
					plannedDurationS: durationS,
					notes: [
						`${intervalDuration}m forte @ ${Math.floor(vamForInterval * 100)}% Vam`,
					],
				},
				{
					plannedDistanceM: useFloat ? intervalDuration : 0,
					orderInBlock: 2,
					segmentKind: useFloat ? "FLOAT" : "REST",
					targetPaceSPerKm: useFloat
						? Math.round(3600 / (vam * 0.6))
						: undefined,
					plannedDurationS:
						level === "intermediate"
							? Math.floor(durationS * FLOAT_REST_INTERMEDIATE_RELATION)
							: durationS,
					notes: [`Descanso ${useFloat ? "trotando" : "parado"}`],
				},
			],
		});
		blocks.push({
			blockKind: "COOLDOWN",
			repeatCount: 1,
			orderIndex: 3,
			description: `Desaquecimento leve | Pace ${warmupPace}`,
			segments: [
				{
					plannedDistanceM: cooldown,
					orderInBlock: 1,
					segmentKind: "COOLDOWN",
					targetPaceSPerKm: Math.round(3600 / warmupVelocity),
				},
			],
		});

		return {
			runType: "INTERVAL",
			scheduledStart: date,
			title: `Treino Intervalado | ${numReps} x ${intervalDuration}m`,
			blocks,
			plannedDistanceM: Math.round(targetVolume * 1000),
			notes: `Intervalo de ${targetVolume}km com ~${intensityKm}km de intensidade. VAM ${vam}km/h. Nível ${level}.`,
		};
	}

	const warmup = Math.min(5, Math.floor(targetVolume * 0.15));
	const cooldown = Math.min(5, Math.floor(targetVolume * 0.1));
	const mainPartMinutes = targetVolume - warmup - cooldown;

	const [intervalDuration, vamForInterval] = getRandomIntervalDistance(
		level,
		mainPartMinutes,
		vam,
	);
	const numReps = Math.floor((mainPartMinutes * 60) / intervalDuration);

	if (
		!isValidInterval({
			unit: "MINUTES",
			reps: numReps,
			level,
			repLength: intervalDuration,
		})
	) {
		attempts++;

		if (attempts >= MAX_ATTEMPTS) {
			throw new Error("Could not generate a valid interval workout.");
		}
		return generateIntervalWorkout({
			date,
			level,
			targetVolume,
			intensityKm,
			vam,
		});
	}

	const blocks: Block[] = [];

	const warmupVelocity = vam * 0.65;
	const warmupPace = formatPace(getPace(warmupVelocity));
	const pace = formatPace(getPace(vamForInterval * vam));

	blocks.push({
		blockKind: "WARMUP",
		repeatCount: 1,
		orderIndex: 1,
		description: `Aquecimento leve | Pace ${warmupPace}`,
		segments: [
			{
				plannedDurationS: warmup * 60,
				orderInBlock: 1,
				segmentKind: "WARMUP",
				targetPaceSPerKm: Math.floor(3600 / warmupVelocity),
			},
		],
	});

	blocks.push({
		blockKind: "WORK",
		repeatCount: numReps,
		orderIndex: 2,
		description: `${numReps} x ${intervalDuration}s @ ${Math.floor(vamForInterval * 100)}% Vam | pace ${pace}`,
		segments: [
			{
				plannedDurationS: intervalDuration,
				orderInBlock: 1,
				segmentKind: "WORK",
				targetPaceSPerKm: Math.round(3600 / (vamForInterval * vam)),
				notes: [`Fazer os intervalos a ${pace}`],
			},
			{
				plannedDurationS: intervalDuration * 2,
				orderInBlock: 2,
				segmentKind: "REST",
				notes: [`Descansar por ${intervalDuration}s parado`],
			},
		],
	});

	blocks.push({
		blockKind: "COOLDOWN",
		repeatCount: 1,
		orderIndex: 3,
		description: `Desaquecimento leve | Pace ${warmupPace}`,
		segments: [
			{
				plannedDurationS: cooldown * 60, // Valor em segundos
				orderInBlock: 1,
				segmentKind: "COOLDOWN",
				targetPaceSPerKm: Math.floor(3600 / warmupVelocity),
			},
		],
	});

	return {
		runType: "INTERVAL",
		scheduledStart: date,
		title: `Treino Intervalado | ${numReps} x ${intervalDuration}s`,
		blocks: blocks,
		plannedDurationS: targetVolume,
		notes: `Intervalo de ${Math.floor(targetVolume)} minutos. VAM ${vam}km/h. Nível ${level}.`,
	};
}
