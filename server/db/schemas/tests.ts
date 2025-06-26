import { relations } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const testType = pgEnum("test_type", [
  "1600m",
  "2400m",
  "3200m",
  "3000m",
  "5000m",
]);

export const tests = pgTable("tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  testType: testType("test_type").notNull(),
  distanceM: integer("distance_m").notNull(),
  durationS: integer("duration_s").notNull(),
  vam: numeric("vam", { mode: "number" }),
  paceMinKm: text("pace_min_km"),
  fcmax: numeric("fcmax", { mode: "number" }),
  vo2Max: numeric("vo2_max", { mode: "number" }),
  vo2: numeric("vo2", { mode: "number" }),
  testDate: date("test_date").notNull(),
});

export const testRelations = relations(tests, ({ one }) => ({
  user: one(user, {
    fields: [tests.userId],
    references: [user.id],
  }),
}));
