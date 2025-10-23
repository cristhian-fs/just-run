import type {
	TIntensityZone,
	TrainingZonesSelect,
	WeeklyIntensityZoneVolume,
	WorkoutWithBlocksAndSegments,
} from "@/shared/types";

import { paceStringToSeconds } from "./time";

export function calculateUserWeeklyIntensity({
	trainingZones,
	workouts,
}: {
	trainingZones: TrainingZonesSelect[];
	workouts: WorkoutWithBlocksAndSegments[];
}): WeeklyIntensityZoneVolume[] {
	const workoutSegments = workouts.flatMap((workout) => workout.segments ?? []);
	const workoutBlocksSegments = workouts.flatMap(
		(workout) =>
			workout.blocks?.flatMap((block) => {
				const repeatCount = block.repeatCount || 1;
				return block.segments.flatMap((segment) =>
					Array.from({ length: repeatCount }, () => ({ ...segment })),
				);
			}) ?? [],
	);
	const allWorkoutSegments = [...workoutSegments, ...workoutBlocksSegments];

	const weeklyIntensity: WeeklyIntensityZoneVolume[] = trainingZones.map(
		(zone, index) => {
			const zonePaceS = paceStringToSeconds(zone.pace ?? "0:00");
			const nextZonePaceS = paceStringToSeconds(
				trainingZones[index + 1]?.pace ?? "0:00",
			);

			const zoneWorkoutSegments = allWorkoutSegments.filter((segment) => {
				const segmentPaceS = segment.targetPaceSPerKm;
				return (
					typeof segmentPaceS === "number" &&
					segmentPaceS <= zonePaceS &&
					segmentPaceS >= nextZonePaceS
				);
			});

			const totalZoneVolume = zoneWorkoutSegments.reduce((acc, segment) => {
				const volumeDistance = segment.plannedDistanceM;

				if (typeof volumeDistance === "number") return acc + volumeDistance;

				if (
					typeof segment.plannedDurationS === "number" &&
					typeof segment.avgPaceSPerKm === "number" &&
					segment.avgPaceSPerKm > 0
				) {
					const estimatedVolumeMetersDistance =
						(segment.plannedDurationS / segment.avgPaceSPerKm) * 1000;

					return acc + estimatedVolumeMetersDistance;
				}

				return acc;
			}, 0);

			return {
				volume: totalZoneVolume,
				zone: zone.name as TIntensityZone,
			};
		},
	);

	const mergedIntensity = weeklyIntensity.reduce((acc, item) => {
		const existing = acc.find((i) => i.zone === item.zone);

		if (existing) {
			existing.volume += item.volume;
		} else {
			acc.push({ ...item });
		}

		return acc;
	}, [] as WeeklyIntensityZoneVolume[]);

	return mergedIntensity;
}
