import { relations, sql } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  segmentKinds,
  trainingTypes,
} from "@/shared/constants/training.constants";

import { trainingWeeks } from "./training-weeks";
import { workoutLogs } from "./workout-logs";

export const trainingType = pgEnum("traning_type", trainingTypes);
export const segmentKind = pgEnum("segment_kind", segmentKinds);

export const workouts = pgTable("workouts", {
  id: uuid("id").defaultRandom().primaryKey(),
  trainingWeekId: uuid("training_week_id")
    .notNull()
    .references(() => trainingWeeks.id, { onDelete: "cascade" }),
  scheduledStart: date("scheduled_start").notNull(),
  runType: trainingType("run_type").notNull(),
  title: text("title"),
  notes: text("notes"),

  // Planejado
  plannedDistanceM: integer("planned_distance_m"),
  plannedDurationS: integer("planned_duration_s"),

  // Executado
  actualDistanceM: integer("actual_distance_m"),
  actualDurationS: integer("actual_duration_s"),
  avgPaceSPerKm: integer("avg_pace_s_per_km"),
  avgHr: integer("avg_hr"),
  elevationGainM: numeric("elevation_gain_m", { mode: "number" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const block = pgTable("block", {
  id: uuid("id").defaultRandom().primaryKey(),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  blockKind: segmentKind("block_kind").notNull(),
  repeatCount: integer("repeat_count").notNull().default(1),
  orderIndex: integer("order_index").notNull(),
  description: text("description"),
});

export const segmentsTable = pgTable(
  "segment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workoutId: uuid("workout_id").references(() => workouts.id, {
      onDelete: "cascade",
    }),

    blockId: uuid("block_id").references(() => block.id, {
      onDelete: "cascade",
    }),
    orderInBlock: integer("order_in_block").notNull(),
    segmentKind: segmentKind("segment_kind").notNull(),

    // Alvo/Planejamento
    plannedDistanceM: integer("planned_distance_m"),
    plannedDurationS: integer("planned_duration_s"),
    targetPaceSPerKm: integer("target_pace_s_per_km"),
    targetHr: integer("target_hr"),

    // Se o segmento for "descanso ativo" ou intervalo parado
    restDistanceM: integer("rest_distance_m"),
    restDurationS: integer("rest_duration_s"),

    // Realizado
    actualDistanceM: integer("actual_distance_m"),
    actualDurationS: integer("actual_duration_s"),
    avgPaceSPerKm: integer("avg_pace_s_per_km"),
    avgHr: integer("avg_hr"),

    notes: text("notes").array(),
  },
  (table) => ({
    ownerChk: sql`
    CHECK (
      ( ${table.blockId} IS NOT NULL AND ${table.workoutId} IS NULL )
      OR 
      ( ${table.blockId} IS NULL AND ${table.workoutId} IS NOT NULL )
    )
  `,
  }),
);

// relations
export const workoutRelations = relations(workouts, ({ many, one }) => ({
  workoutLogs: many(workoutLogs),
  trainingWeek: one(trainingWeeks, {
    fields: [workouts.trainingWeekId],
    references: [trainingWeeks.id],
  }),
  blocks: many(block),
  segments: many(segmentsTable),
}));

export const workoutBlocksRelations = relations(block, ({ one }) => ({
  workout: one(workouts, {
    fields: [block.workoutId],
    references: [workouts.id],
  }),
}));

export const workoutSegmentRelations = relations(segmentsTable, ({ one }) => ({
  /* renomeie 'segment' → 'workout' */
  workout: one(workouts, {
    fields: [segmentsTable.workoutId],
    references: [workouts.id],
  }),
  block: one(block, {
    fields: [segmentsTable.blockId],
    references: [block.id],
  }),
}));
