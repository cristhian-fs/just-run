import { relations } from "drizzle-orm";
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

export const goalType = pgEnum("goal_type", [
	"startRunning",
	"improveHealth",
	"loseWeight",
	"runFaster",
	"runLonger",
	"race5K",
	"race10K",
	"race21K",
	"race42K",
]);

export const goal = pgTable("goals", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	goalType: goalType("goal_type"),
	targetTime: text("target_time"),
	weeklyFrequency: integer("weekly_frequency").notNull(),
	eventDate: date("event_date"),
	createdAt: timestamp("created_at").notNull(),
});

export const goalRelations = relations(goal, ({ one }) => ({
	user: one(user, {
		fields: [goal.userId],
		references: [user.id],
	}),
}));
