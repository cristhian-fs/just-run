import { relations } from "drizzle-orm";
import {
  date,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const goalType = pgEnum("goal_type", ["5K", "10K", "21K", "42K"]);

export const goal = pgTable("goals", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  goalType: goalType("goal_type").notNull(),
  targetTime: time("target_time").notNull(),
  eventDate: date("event_date").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const goalRelations = relations(goal, ({ one }) => ({
  user: one(user, {
    fields: [goal.userId],
    references: [user.id],
  }),
}));
