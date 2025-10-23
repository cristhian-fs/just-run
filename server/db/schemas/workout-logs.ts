import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { workouts } from "./workouts";

export const workoutLogs = pgTable("workout_logs", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	workoutId: uuid("workout_id")
		.notNull()
		.references(() => workouts.id, { onDelete: "cascade" }),
	actualTimeS: integer("actual_time_s").notNull(),
	actualDistanceM: integer("actual_distance_m").notNull(),
	perceivedEffort: integer("perceived_effort").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").notNull(),
});

export const workoutLogRelations = relations(workoutLogs, ({ one }) => ({
	user: one(user, {
		fields: [workoutLogs.userId],
		references: [user.id],
	}),
	workout: one(workouts, {
		fields: [workoutLogs.workoutId],
		references: [workouts.id],
	}),
}));
