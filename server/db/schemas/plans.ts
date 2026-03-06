import { relations, sql } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { segmentKind, trainingType } from "./workouts";
import { paceReferenceEnums } from "@/shared/constants/training.constants";

export const levelEnum = pgEnum("level", [
  "beginner",
  "intermediate",
  "advanced",
  "elite",
]);

export const paceReferenceEnum = pgEnum('pace_reference', paceReferenceEnums);

// Define a plan
export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  level: levelEnum("level").notNull(),
  description: text("description"),
  coach: text("coach"),
  weeklyVolume: integer("weekly_volume").notNull(),
  distances: text("distances").array().default([]),
  totalWeeks: integer("total_weeks").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

// Weeks of the plan
export const planWeeks = pgTable("plan_weeks", {
  id: uuid("id").defaultRandom().primaryKey(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  weekNumber: integer("week_number").notNull(), // 1..24
  totalVolumeMin: integer("total_volume_min").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Workouts of the plan
export const planWorkouts = pgTable("plan_workouts", {
  id: uuid("id").defaultRandom().primaryKey(),
  planWeekId: uuid("plan_week_id")
    .notNull()
    .references(() => planWeeks.id, { onDelete: "cascade" }),
  runType: trainingType("run_type").notNull(),
  title: text("title"),
  notes: text("notes"),
  plannedDistanceM: integer("planned_distance_m"),
  plannedDurationS: integer("planned_duration_s"),
  dayIndex: integer("day_index").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Blocks of the plan workout / same logic from workouts
export const planBlocks = pgTable("plan_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  workoutId: uuid("workout_id")
    .notNull()
    .references(() => planWorkouts.id, { onDelete: "cascade" }),
  blockKind: segmentKind("block_kind").notNull(),
  repeatCount: integer("repeat_count").notNull().default(1),
  orderIndex: integer("order_index").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// segments of the plan block / same logic from workouts
export const planSegments = pgTable(
  "plan_segments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workoutId: uuid("workout_id").references(() => planWorkouts.id, {
      onDelete: "cascade",
    }),
    blockId: uuid("block_id").references(() => planBlocks.id, {
      onDelete: "cascade",
    }),
    orderInBlock: integer("order_in_block").notNull(),
    segmentKind: segmentKind("segment_kind").notNull(),
    plannedDistanceM: integer("planned_distance_m"),
    plannedDurationS: integer("planned_duration_s"),
    targetPaceSPerKm: integer("target_pace_s_per_km"),
    targetHr: integer("target_hr"),

    targetPaceReference: paceReferenceEnum('target_pace_reference'),
    paceOffsetSPerKm: integer('pace_offset_s_per_km'),
    createdAt: timestamp("created_at").notNull().defaultNow(),
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

// Define active plans
export const activePlans = pgTable("active_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Defining relations
export const activePlansRelations = relations(activePlans, ({ one }) => ({
  plan: one(plans, {
    fields: [activePlans.planId],
    references: [plans.id],
  }),
  user: one(user, {
    fields: [activePlans.userId],
    references: [user.id],
  }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  planWeeks: many(planWeeks),
  activePlans: many(activePlans),
}));

export const planWeekRelations = relations(planWeeks, ({ many, one }) => ({
  planWorkouts: many(planWorkouts),
  plan: one(plans, {
    fields: [planWeeks.planId],
    references: [plans.id],
  }),
}));

export const planWorkoutRelations = relations(
  planWorkouts,
  ({ many, one }) => ({
    planBlocks: many(planBlocks),
    planSegments: many(planSegments),
    planWeek: one(planWeeks, {
      fields: [planWorkouts.planWeekId],
      references: [planWeeks.id],
    }),
  }),
);

export const planBlocksRelations = relations(planBlocks, ({ many, one }) => ({
  planSegments: many(planSegments),
  planWorkout: one(planWorkouts, {
    fields: [planBlocks.workoutId],
    references: [planWorkouts.id],
  }),
}));

export const planSegmentRelations = relations(planSegments, ({ one }) => ({
  planWorkout: one(planWorkouts, {
    fields: [planSegments.workoutId],
    references: [planWorkouts.id],
  }),
  planBlock: one(planBlocks, {
    fields: [planSegments.blockId],
    references: [planBlocks.id],
  }),
}));
