import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import { z } from "zod";

import {
  account,
  genderEnum,
  session,
  user,
  userRelations,
  verification,
} from "./schemas/auth";
import { goal, goalType } from "./schemas/goals";
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
  workouts,
  workoutSegmentRelations,
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
    userRelations,
    goal,
    goalType,
    testType,
    tests,
    trainingWeeks,
    traningWeekRelations,
    weekType,
    trainingZones,
    workoutLogs,
    trainingType,
    workoutRelations,
    workouts,
    genderEnum,
    blocks,
    segmentKind,
    segmentsTable,
    workoutBlocksRelations,
    workoutSegmentRelations,
  },
});
