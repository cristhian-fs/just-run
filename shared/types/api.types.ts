import type {
	planBlocks,
	planSegments,
	plans,
	planWeeks,
	planWorkouts,
} from "@/db/schemas/plans";
import type { ApiRoutes } from "../../server";
import type {
	TIntensityZone,
	TSegmentKind,
	TTrainingType,
} from "./training.types";

export type { ApiRoutes };

export type SuccessResponse<T = void> = {
	success: true;
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
	success: false;
	error: string;
	isFormError?: boolean;
};

export interface WeeklyVolumeData {
	weekGoalM: number;
	currentWeekVolume: number;
	lastWeekVolume: number;
	weekProgress: number;
	progressOverWeek: number;
}

export interface MonthSummary {
	totalDistance: number;
	goalDistance: number;
	totalRuns: number;
	totalTimeMinutes: number;
	avgPaceS: number;
}

export interface VolumeProgression {
	date: string;
	volume: number | null;
	minutes: number | null;
}

export interface WeeklyIntensityZoneVolume {
	zone: TIntensityZone;
	volume: number;
}

export type TrainingPlan = {
	id: string;
	name: string;
	level: "beginner" | "intermediate" | "advanced" | "elite";
	description: string | null;
	coach: string | null;
	weeklyVolume: number;
	totalWeeks: number;
	distances: string[];
	createdAt: Date;
};
export type TrainingPlanWeek = {
	id: string;
	planId: string;
	weekNumber: number;
	totalVolumeMin: number;
};
export type TrainingPlanWorkout = {
	id: string;
	planWeekId: string;
	runType: TTrainingType;
	title: string | null;
	notes: string | null;
	plannedDistanceM: number | null;
	plannedDurationS: number | null;
};
export type TrainingPlanBlock = {
	id: string;
	description: string | null;
	workoutId: string;
	blockKind: TSegmentKind;
	repeatCount: number;
	orderIndex: number;
};
export type TrainingPlanSegment = {
	id: string;
	plannedDistanceM: number | null;
	plannedDurationS: number | null;
	workoutId: string | null;
	blockId: string | null;
	orderInBlock: number;
	segmentKind: TSegmentKind;
	targetPaceSPerKm: number | null;
	targetHr: number | null;
};

export type TrainingPlanSelect = TrainingPlan & {
	planWeeks: TrainingPlanWeekWithWorkouts[];
};

export type PlanBlockWithSegment = TrainingPlanBlock & {
	planSegments: TrainingPlanSegment[];
};

export type TrainingPlanWorkoutWithBlock = TrainingPlanWorkout & {
	planBlocks: PlanBlockWithSegment[];
};

export type TrainingPlanWeekWithWorkouts = TrainingPlanWeek & {
	planWorkouts: TrainingPlanWorkoutWithBlock[];
};

export type TrainingPlanWorkoutWithSchedule = TrainingPlanWorkoutWithBlock & {
	scheduledDate: Date;
};
export type TrainingPlanWeekWithSchedule = TrainingPlanWeek & {
	planWorkouts: TrainingPlanWorkoutWithSchedule[];
};
export type TrainingPlanWithSchedule = TrainingPlan & {
	planWeeks: TrainingPlanWeekWithSchedule[];
};
