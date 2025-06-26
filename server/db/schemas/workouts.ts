import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { trainingWeeks } from "./training-weeks";
import { workoutLogs } from "./workout-logs";

export const trainingType = pgEnum("traning_type", [
  "EASY_RUN",
  "LONG_RUN",
  "INTERVAL",
  "FARTLEK",
  "PROGRESSIVE_RUN",
  "REPETITION",
  "THRESHOLD_RUN",
  "RECOVERY_RUN",
]);

export const workoutUnit = pgEnum("workout_unit", ["KM", "MINUTES"]);
const restType = pgEnum("rest_type", ["PASSIVE", "ACTIVE"]);

export const workouts = pgTable(
  "workouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    trainingWeekId: uuid("training_week_id")
      .notNull()
      .references(() => trainingWeeks.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    type: trainingType("type").notNull(),
    description: text("description"),
    intensityZone: integer("intensity_zone"),
    durationMin: integer("duration_min"),
    durationKm: numeric("duration_km", { mode: "number" }),
    isCompleted: boolean("is_completed").notNull(),

    // novos campos opcionais para treinos intervalados, fartlek, threshold, etc
    unit: workoutUnit("unit"),
    totalVolume: numeric("total_volume", { mode: "number" }),
    restBetweenRepsMin: numeric("rest_between_reps_min", { mode: "number" }),
    intenseVolume: numeric("intense_volume", { mode: "number" }),
    targetZones: integer("target_zones").array(),

    // reps
    totalReps: integer("total_reps"), // para indicar quantas reps existem
    repsPace: text("reps_pace"),
    repsDistanceKm: numeric("reps_distance_km", { mode: "number" }),
    restType: restType("rest_type"),

    // warmup e cooldown
    warmupDistanceKm: numeric("warmup_distance_km", { mode: "number" }),
    cooldownDistanceKm: numeric("cooldown_distance_km", { mode: "number" }),
  },
  (table) => [
    check(
      "intensity_zone",
      sql`${table.intensityZone} >= 1 and ${table.intensityZone} <= 10`,
    ),
  ],
);

export const workoutBlocks = pgTable("workout_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),

  order: integer("order").notNull(),

  // tipo de bloco: warmup, main, progression, cooldown, recovery, etc
  type: text("type"), // 'warmup' | 'main' | 'cooldown' | 'progression' | etc

  vamIntensity: numeric("vam_intensity", { mode: "number" }),
  targetZone: integer("target_zone"),
  pace: text("pace"),

  distanceKm: numeric("distance_km", { mode: "number" }),
  durationMin: numeric("duration_min", { mode: "number" }),

  description: text("description"),
  phase: text("phase"),
  blockType: text("block_type"), // e.g., "warmup" | "main" | "progression" | "cooldown"
  effort: text("effort"), // e.g., "easy", "moderate", "hard"
  unit: text("unit"), // "KM" | "MINUTES"
});

// relations
export const workoutRelations = relations(workouts, ({ many, one }) => ({
  workoutLogs: many(workoutLogs),
  trainingWeek: one(trainingWeeks, {
    fields: [workouts.trainingWeekId],
    references: [trainingWeeks.id],
  }),
  blocks: many(workoutBlocks),
}));

export const workoutBlocksRelations = relations(workoutBlocks, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutBlocks.workoutId],
    references: [workouts.id],
  }),
}));
