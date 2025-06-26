import { relations } from "drizzle-orm";
import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const trainingZones = pgTable("training_zones", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  workouts: text("workouts").array(),
  vo2Percentage: numeric("vo2_percentage", { mode: "number" }),
  pace: text("pace"),
  velocity: numeric("velocity", { mode: "number" }),
  cardioFrequency: numeric("cardio_frequency", { mode: "number" }),
  vo2Max: numeric("vo2_max", { mode: "number" }),
  createdAt: timestamp("created_at").notNull(),
});

export const trainingZoneRelations = relations(trainingZones, ({ one }) => ({
  user: one(user, {
    fields: [trainingZones.userId],
    references: [user.id],
  }),
}));
