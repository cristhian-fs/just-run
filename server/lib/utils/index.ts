import {
  workoutSchema,
  type BlockFormData,
  type SegmentFormData,
  type WorkoutFormData,
} from "@/shared/schemas";
import type { Block, Segment, Workout } from "@/shared/types";

export const formatDate = (date: Date): string =>
  date.toISOString().split("T")[0]!;

export const parseHHMMSS = (time: string): number => {
  const [hh, mm, ss] = time.split(":").map(Number);
  return (hh || 0) * 3600 + (mm || 0) * 60 + (ss || 0);
};
export const parseMMSS = (time: string): number => {
  const [mm, ss] = time.split(":").map(Number);
  return (mm || 0) * 60 + (ss || 0);
};

const nullIfZero = <T extends number | undefined>(value: T): T | undefined => {
  return value === 0 ? undefined : value;
};

export const parseWorkoutDto = (workoutData: WorkoutFormData): Workout => {
  const parsed = workoutSchema.parse(workoutData);
  const parseSegment = (seg: SegmentFormData): Segment => ({
    orderInBlock: seg.orderInBlock,
    segmentKind: seg.segmentKind,
    plannedDistanceM: nullIfZero(seg.plannedDistanceM),
    plannedDurationS: seg.duration
      ? nullIfZero(parseHHMMSS(seg.duration))
      : undefined,
    targetPaceSPerKm: seg.targetPaceTime
      ? nullIfZero(parseMMSS(seg.targetPaceTime))
      : undefined,
    targetHr: seg.targetHr,
    restDistanceM: seg.restDistanceM,
    restDurationS: seg.restDuration
      ? nullIfZero(parseMMSS(seg.restDuration))
      : undefined,
    actualDistanceM: seg.actualDistanceM,
    actualDurationS: seg.actualDurationS,
    avgPaceSPerKm: seg.avgPaceSPerKm,
    avgHr: seg.avgHr,
    notes: seg.notes ? [seg.notes] : undefined,
  });

  const parseBlock = (block: BlockFormData): Block => ({
    blockKind: block.blockKind,
    repeatCount: block.repeatCount,
    orderIndex: block.orderIndex,
    description: block.description,
    segments: block.segments.map(parseSegment),
  });

  const workout: Workout = {
    scheduledStart: parsed.scheduledStart,
    runType: parsed.runType,
    title: parsed.title,
    notes: parsed.notes,
    plannedDistanceM: nullIfZero(parsed.plannedDistanceM),
    plannedDurationS: parsed.duration
      ? nullIfZero(parseHHMMSS(parsed.duration))
      : undefined,
    actualDistanceM: parsed.actualDistanceM,
    actualDurationS: parsed.actualDurationS,
    avgPaceSPerKm: parsed.avgPaceSPerKm,
    avgHr: parsed.avgHr,
    elevationGainM: parsed.elevationGainM,
    segments: parsed.segments?.map(parseSegment),
    blocks: parsed.blocks?.map(parseBlock),
  };

  return workout;
};
