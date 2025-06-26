import { relations } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { goal } from "./goals";
import { tests } from "./tests";
import { trainingWeeks } from "./training-weeks";
import { trainingZones } from "./training-zones";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const trainingLevelEnum = pgEnum("training_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  age: numeric("age", { mode: "number" }),
  gender: genderEnum("gender"),
  weightKg: numeric("weight_kg", { mode: "number" }),
  heightCm: numeric("height_cm", { mode: "number" }),
  trainingLevel: trainingLevelEnum("training_level"),
  hasCompleteOnboarding: boolean("has_complete_onboarding")
    .notNull()
    .default(false),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// relations
export const userRelations = relations(user, ({ many }) => ({
  trainingZones: many(trainingZones),
  goals: many(goal),
  trainingWeeks: many(trainingWeeks),
  tests: many(tests),
}));
