import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { workouts } from "./workouts";

export const weekType = pgEnum("week_type", [
  "BASE",
  "BUILD",
  "PEAK",
  "DELOAD",
]);

export const trainingWeeks = pgTable("training_weeks", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  weekStart: date("week_start").notNull(),
  weekType: weekType("week_type").notNull(),
  totalVolumeMin: integer("total_volume_min").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

// relations
export const traningWeekRelations = relations(
  trainingWeeks,
  ({ many, one }) => ({
    workouts: many(workouts),
    user: one(user, {
      fields: [trainingWeeks.userId],
      references: [user.id],
    }),
  }),
);
