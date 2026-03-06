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
  const sortedZones = [...trainingZones].sort(
    (a, b) =>
      paceStringToSeconds(b.pace ?? "0:00") -
      paceStringToSeconds(a.pace ?? "0:00"),
  );

  const allWorkoutSegments =
    workoutBlocksSegments.length > 0
      ? workoutBlocksSegments
      : workoutSegments;

  const weeklyIntensity = sortedZones.map((zone, index) => {
    const maxPace = paceStringToSeconds(zone.pace ?? "0:00");
    const minPace =
      index < sortedZones.length - 1
        ? paceStringToSeconds(sortedZones[index + 1]?.pace ?? "0:00")
        : 0;

    const zoneWorkoutSegments = allWorkoutSegments.filter((segment) => {
      const pace = segment.targetPaceSPerKm;
      return typeof pace === "number" && pace >= minPace && pace < maxPace;
    });

    const volume = zoneWorkoutSegments.reduce((acc, segment) => {
      if (typeof segment.plannedDistanceM === "number") {
        return acc + segment.plannedDistanceM;
      }

      if (
        typeof segment.plannedDurationS === "number" &&
        typeof segment.targetPaceSPerKm === "number" &&
        segment.targetPaceSPerKm > 0
      ) {
        return (
          acc +
          (segment.plannedDurationS / segment.targetPaceSPerKm) * 1000
        );
      }

      return acc;
    }, 0);

    return {
      zone: zone.name as TIntensityZone,
      volume,
    };
  });

  const mergedIntensity = weeklyIntensity.reduce((acc, item) => {
    const existing = acc.find((i) => i.zone === item.zone);

    if (existing) {
      existing.volume += item.volume;
    } else {
      acc.push({ ...item });
    }

    return acc;
  }, [] as WeeklyIntensityZoneVolume[]);

  return mergedIntensity
}
