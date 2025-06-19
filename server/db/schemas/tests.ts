import { relations } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const testType = pgEnum("test_type", ["3K", "5K", "6K", "10K", "21K"]);

export const tests = pgTable("tests", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  testType: testType("test_type").notNull(),
  distanceM: integer("distance_m").notNull(),
  durationS: integer("duration_s").notNull(),
  paceMinKm: numeric("pace_min_km", { mode: "number" }),
  testDate: date("test_date").notNull(),
});

export const testRelations = relations(tests, ({ one }) => ({
  user: one(user, {
    fields: [tests.userId],
    references: [user.id],
  }),
}));
