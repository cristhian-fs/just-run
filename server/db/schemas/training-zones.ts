import { relations } from "drizzle-orm";
import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const trainingZones = pgTable("training_zones", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  vamKmh: numeric("vam_kmh", { mode: "number" }).notNull(),
  zone1Min: numeric("zone_1_min", { mode: "number" }).notNull(),
  zone1Max: numeric("zone_1_max", { mode: "number" }).notNull(),
  zone2Min: numeric("zone_2_min", { mode: "number" }).notNull(),
  zone2Max: numeric("zone_2_max", { mode: "number" }).notNull(),
  zone3Min: numeric("zone_3_min", { mode: "number" }).notNull(),
  zone3Max: numeric("zone_3_max", { mode: "number" }).notNull(),
  zone4Min: numeric("zone_4_min", { mode: "number" }).notNull(),
  zone4Max: numeric("zone_4_max", { mode: "number" }).notNull(),
  zone5Min: numeric("zone_5_min", { mode: "number" }).notNull(),
  zone5Max: numeric("zone_5_max", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const trainingZoneRelations = relations(trainingZones, ({ one }) => ({
  user: one(user, {
    fields: [trainingZones.userId],
    references: [user.id],
  }),
}));
