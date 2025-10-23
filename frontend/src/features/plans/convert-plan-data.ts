import { addDays } from "date-fns";
import type {
	PlanBlockWithSegment,
	TrainingPlanSegment,
	TrainingPlanSelect,
	TrainingPlanWeekWithSchedule,
	TrainingPlanWithSchedule,
	TrainingPlanWorkoutWithSchedule,
} from "@/shared/types";
import { PhysiologyCalculator } from "../vdot/physiology-calculator";
import { HeartRaceZone } from "../vdot/types";

type TCovertPlanData = {
	plan: TrainingPlanSelect;
	userTest: {
		distance: number;
		duration: number;
	};
};

function getPaceForSegment(
	segmentKind: TrainingPlanSegment["segmentKind"],
	userTest: {
		distance: number;
		duration: number;
	},
): number | null {
	const vdotPercentage = PhysiologyCalculator.calculateVDOTPercentage({
		timeInSeconds: userTest.duration,
	});

	const vdot = PhysiologyCalculator.calculateVDOT({
		distanceM: userTest.distance,
		durationS: userTest.duration,
		VDOTPercentage: vdotPercentage,
	});

	const intervalPaceInSeconds = PhysiologyCalculator.calculatePeriodPace({
		calcVDOT: vdot,
		vdotIntensity: 0.98,
	});

	const repetitionIntervalPaceInSeconds =
		PhysiologyCalculator.calculateRepetitionPace({
			intervalPaceInSeconds,
		});

	const thresholdPace = PhysiologyCalculator.calculatePeriodPace({
		calcVDOT: vdot,
		vdotIntensity: 0.88,
	});

	const totalTimeMarathonProjection =
		PhysiologyCalculator.calculateRaceProjection({
			durationS: userTest.duration,
			selectedDistance: HeartRaceZone.Marathon,
			distanceMiles: userTest.distance / 1609.34,
		});

	const marathonPaceProjection =
		PhysiologyCalculator.calculateRacePaceProjection({
			selectedDistance: HeartRaceZone.Marathon,
			totalTime: totalTimeMarathonProjection,
		});

	const easyPaceProjection = +PhysiologyCalculator.calculatePace({
		calcVDOT: vdot,
		vdotPercentage: 0.67,
		correctionFactor: 0,
		type: "seconds",
	});

	switch (segmentKind) {
		case "COOLDOWN":
			return easyPaceProjection;

		case "FLOAT":
			return easyPaceProjection;

		case "INTERVAL":
			return intervalPaceInSeconds;

		case "REPETITION":
			return repetitionIntervalPaceInSeconds;

		case "THRESHOLD":
			return thresholdPace;

		case "MARATHON":
			return marathonPaceProjection;

		case "WARMUP":
			return easyPaceProjection;

		case "WORK":
			return easyPaceProjection;

		default:
			return null;
	}
}

export const convertPlanData = ({
	plan,
	userTest,
}: TCovertPlanData): TrainingPlanWithSchedule => {
	const today = new Date();
	const newPlanWeeks: TrainingPlanWeekWithSchedule[] = plan.planWeeks.map(
		(week) => {
			const newWorkouts: TrainingPlanWorkoutWithSchedule[] =
				week.planWorkouts.map((workout, index) => {
					const offsetDays = (week.weekNumber - 1) * 7 + index;
					const scheduledDate = addDays(today, offsetDays);
					// Atualiza blocos e segmentos
					const newBlocks: PlanBlockWithSegment[] = workout.planBlocks.map(
						(block) => {
							const newSegments: TrainingPlanSegment[] = block.planSegments.map(
								(segment) => {
									const targetPaceSPerKm = getPaceForSegment(
										segment.segmentKind,
										{
											distance: userTest.distance,
											duration: userTest.duration,
										},
									);
									let plannedDistanceM = segment.plannedDistanceM ?? null;
									let plannedDurationS = segment.plannedDurationS ?? null;

									if (targetPaceSPerKm) {
										if (
											(plannedDistanceM === null || plannedDistanceM === 0) &&
											plannedDurationS
										) {
											// Calcular distância
											plannedDistanceM =
												(plannedDurationS / targetPaceSPerKm) * 1000;
										} else if (
											(plannedDurationS === null || plannedDurationS === 0) &&
											plannedDistanceM
										) {
											// Calcular duração
											plannedDurationS =
												(plannedDistanceM / 1000) * targetPaceSPerKm;
										}
									}
									return {
										...segment,
										targetPaceSPerKm: targetPaceSPerKm
											? Math.floor(targetPaceSPerKm)
											: null,
										plannedDistanceM: plannedDistanceM
											? Math.floor(plannedDistanceM)
											: null,
										plannedDurationS: plannedDurationS
											? Math.floor(plannedDurationS)
											: null,
									};
								},
							);
							return {
								...block,
								planSegments: newSegments,
							};
						},
					);

					const plannedDistanceM = Math.floor(
						newBlocks.reduce((acc, curr) => {
							return (
								(acc +
									curr.planSegments.reduce((acc, curr) => {
										return acc + (curr.plannedDistanceM ?? 0);
									}, 0)) *
								curr.repeatCount
							);
						}, 0),
					);

					const plannedDurationS = Math.floor(
						newBlocks.reduce((acc, curr) => {
							return (
								(acc +
									curr.planSegments.reduce((acc, curr) => {
										return acc + (curr.plannedDurationS ?? 0);
									}, 0)) *
								curr.repeatCount
							);
						}, 0),
					);
					return {
						...workout,
						scheduledDate,
						planBlocks: newBlocks,
						plannedDistanceM, // Agora em metros totais (ex.: 10000 para 10km)
						plannedDurationS, // Agora em segundos totais (ex.: 3600 para 1h)
					};
				});

			const totalVolumeMin = Math.floor(
				newWorkouts.reduce((acc, curr) => {
					return (
						acc +
						(curr.planBlocks ?? []).reduce((acc, curr) => {
							return (
								acc +
								curr.planSegments.reduce((acc, curr) => {
									return acc + (curr.plannedDistanceM ?? 0);
								}, 0)
							);
						}, 0)
					);
				}, 0) / 1000,
			);
			return {
				...week,
				totalVolumeMin,
				planWorkouts: newWorkouts,
			};
		},
	);
	// biome-ignore lint/correctness/noUnusedVariables: will be replaced
	const { planWeeks, ...rest } = plan;
	return {
		...rest,
		planWeeks: newPlanWeeks,
	};
};
