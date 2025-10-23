import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import env from "@/env-runtime";
import {
	account,
	genderEnum,
	session,
	user,
	userRelations,
	verification,
} from "./schemas/auth";
import { goal, goalType } from "./schemas/goals";
import {
	activePlans,
	activePlansRelations,
	levelEnum,
	planBlocks,
	planBlocksRelations,
	planSegmentRelations,
	planSegments,
	plans,
	plansRelations,
	planWeekRelations,
	planWeeks,
	planWorkoutRelations,
	planWorkouts,
} from "./schemas/plans";
import { tests, testType } from "./schemas/tests";
import {
	trainingWeeks,
	traningWeekRelations,
	weekType,
} from "./schemas/training-weeks";
import { trainingZones } from "./schemas/training-zones";
import { workoutLogs } from "./schemas/workout-logs";
import {
	blocks,
	segmentKind,
	segmentsTable,
	trainingType,
	workoutBlocksRelations,
	workoutRelations,
	workoutSegmentRelations,
	workouts,
} from "./schemas/workouts";

const EnvSchema = z.object({
	DATABASE_URL: z.string().url(),
});

const processEnv = EnvSchema.parse(process.env);
const queryClient = postgres(processEnv.DATABASE_URL);
export const db = drizzle(queryClient, {
	schema: {
		user,
		account,
		session,
		verification,
		goal,
		goalType,
		testType,
		tests,
		trainingWeeks,
		weekType,
		trainingZones,
		workoutLogs,
		trainingType,
		workouts,
		genderEnum,
		levelEnum,
		blocks,
		segmentKind,
		segmentsTable,
		planWorkouts,
		planWeeks,
		planSegments,
		planBlocks,
		plans,
		userRelations,
		traningWeekRelations,
		workoutRelations,
		planBlocksRelations,
		planSegmentRelations,
		workoutSegmentRelations,
		planWorkoutRelations,
		workoutBlocksRelations,
		planWeekRelations,
		plansRelations,
		activePlans,
		activePlansRelations,
	},
});

export type db = typeof db;

export const connection = postgres(env.DATABASE_URL, {
	max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
	onnotice: env.DB_SEEDING ? () => {} : undefined,
});
