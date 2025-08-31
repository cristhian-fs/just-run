import { relations, sql } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	jsonb,
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
import { user } from "./auth";
import { plans } from "./plans";
import { trainingWeeks } from "./training-weeks";
import { workoutLogs } from "./workout-logs";

export const trainingType = pgEnum("traning_type", trainingTypes);
export const segmentKind = pgEnum("segment_kind", segmentKinds);

export const workoutAnalytics = pgTable("workout_analytics", {
	id: uuid("id").defaultRandom().primaryKey(),
	planId: uuid("plan_id"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	completedAt: date("completed_at").notNull(),
	analyticsData: jsonb("analytics_data").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
	isCompleted: boolean("is_completed").notNull().default(false),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blocks = pgTable("blocks", {
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
	"segments",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		workoutId: uuid("workout_id").references(() => workouts.id, {
			onDelete: "cascade",
		}),

		blockId: uuid("block_id").references(() => blocks.id, {
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
	blocks: many(blocks),
	segments: many(segmentsTable),
}));

export const workoutAnalyticsRelations = relations(
	workoutAnalytics,
	({ one }) => ({
		user: one(user, {
			fields: [workoutAnalytics.userId],
			references: [user.id],
		}),
		plan: one(plans, {
			fields: [workoutAnalytics.planId],
			references: [plans.id],
		}),
	}),
);

export const workoutBlocksRelations = relations(blocks, ({ one, many }) => ({
	workout: one(workouts, {
		fields: [blocks.workoutId],
		references: [workouts.id],
	}),
	segments: many(segmentsTable),
}));

export const workoutSegmentRelations = relations(segmentsTable, ({ one }) => ({
	workout: one(workouts, {
		fields: [segmentsTable.workoutId],
		references: [workouts.id],
	}),
	block: one(blocks, {
		fields: [segmentsTable.blockId],
		references: [blocks.id],
	}),
}));
