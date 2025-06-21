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

export const workouts = pgTable(
  "workouts",
  {
    id: text("id").primaryKey(),
    trainingWeekId: text("training_week_id")
      .notNull()
      .references(() => trainingWeeks.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    type: trainingType("type").notNull(),
    description: text("description"),
    intensityZone: integer("intensity_zone"),
    durationMin: integer("duration_min").notNull(),
    durationKm: numeric("duration_km", { mode: "number" }),
    isCompleted: boolean("is_completed").notNull(),

    // novos campos opcionais
    warmupKm: numeric("warmup_km", { mode: "number" }),
    cooldownKm: numeric("cooldown_km", { mode: "number" }),
    restBetweenRepsMin: numeric("rest_between_reps_min", { mode: "number" }),
    totalReps: integer("total_reps"), // para indicar quantas reps existem
  },
  (table) => [
    check(
      "intensity_zone",
      sql`${table.intensityZone} >= 1 and ${table.intensityZone} <= 10`,
    ),
  ],
);

export const workoutReps = pgTable("workout_reps", {
  id: text("id").primaryKey(),
  workoutId: text("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),

  order: integer("order").notNull(), // ordem da repetição
  distanceKm: numeric("distance_km", { mode: "number" }).notNull(),
  durationMin: numeric("duration_min", { mode: "number" }),
  targetZone: integer("target_zone"), // Z1 a Z5, se quiser explicitar

  description: text("description"),
});

export const workoutBlocks = pgTable("workout_blocks", {
  id: text("id").primaryKey(),
  workoutId: text("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),

  order: integer("order").notNull(),

  // tipo de bloco: warmup, main, progression, cooldown, recovery, etc
  type: text("type").notNull(), // 'warmup' | 'main' | 'cooldown' | 'progression' | etc

  vamIntensity: numeric("vam_intensity", { mode: "number" }),
  targetZone: integer("target_zone"),
  pace: text("pace"),

  distanceKm: numeric("distance_km", { mode: "number" }),
  durationMin: numeric("duration_min", { mode: "number" }),

  description: text("description"),

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
  reps: many(workoutReps),
  blocks: many(workoutBlocks),
}));

export const workoutRepsRelations = relations(workoutReps, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutReps.workoutId],
    references: [workouts.id],
  }),
}));

export const workoutBlocksRelations = relations(workoutBlocks, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutBlocks.workoutId],
    references: [workouts.id],
  }),
}));
