CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."training_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."goal_type" AS ENUM('startRunning', 'improveHealth', 'loseWeight', 'runFaster', 'runLonger', 'race5K', 'race10K', 'race21K', 'race42K');--> statement-breakpoint
CREATE TYPE "public"."test_type" AS ENUM('1600m', '2400m', '3200m', '3000m', '5000m');--> statement-breakpoint
CREATE TYPE "public"."traning_type" AS ENUM('EASY_RUN', 'LONG_RUN', 'INTERVAL', 'FARTLEK', 'PROGRESSIVE_RUN', 'REPETITION', 'THRESHOLD_RUN', 'RECOVERY_RUN');--> statement-breakpoint
CREATE TYPE "public"."week_type" AS ENUM('INTRO', 'TEST', 'BASE', 'BUILD', 'PEAK', 'TAPER', 'DELOAD', 'COMPETITION');--> statement-breakpoint
CREATE TYPE "public"."workout_unit" AS ENUM('KM', 'MINUTES');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"age" numeric,
	"gender" "gender",
	"weight_kg" numeric,
	"height_cm" numeric,
	"training_level" "training_level",
	"has_complete_onboarding" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"goal_type" "goal_type",
	"target_time" text,
	"weekly_frequency" integer NOT NULL,
	"event_date" date,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"test_type" "test_type" NOT NULL,
	"distance_m" integer NOT NULL,
	"duration_s" integer NOT NULL,
	"vam" numeric,
	"pace_min_km" text,
	"fcmax" numeric,
	"vo2_max" numeric,
	"vo2" numeric,
	"test_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"week_start" date NOT NULL,
	"week_type" "week_type" NOT NULL,
	"total_volume_min" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"workouts" text[],
	"vo2_percentage" numeric,
	"pace" text,
	"velocity" numeric,
	"cardio_frequency" numeric,
	"vo2_max" numeric,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"workout_id" uuid NOT NULL,
	"actual_time_s" integer NOT NULL,
	"actual_distance_m" integer NOT NULL,
	"perceived_effort" integer NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"training_week_id" uuid NOT NULL,
	"date" date NOT NULL,
	"type" "traning_type" NOT NULL,
	"description" text,
	"intensity_zone" integer,
	"duration_min" integer,
	"duration_km" numeric,
	"is_completed" boolean NOT NULL,
	"unit" "workout_unit",
	"total_volume" numeric,
	"rest_between_reps_min" numeric,
	"intense_volume" numeric,
	"target_zones" integer[],
	"total_reps" integer,
	"reps_pace" text,
	"reps_distance_km" numeric,
	"rest_type" "rest_type",
	"warmup_distance_km" numeric,
	"cooldown_distance_km" numeric,
	CONSTRAINT "intensity_zone" CHECK ("workouts"."intensity_zone" >= 1 and "workouts"."intensity_zone" <= 10)
);
--> statement-breakpoint
CREATE TABLE "workout_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"type" text,
	"vam_intensity" numeric,
	"target_zone" integer,
	"pace" text,
	"distance_km" numeric,
	"duration_min" numeric,
	"description" text,
	"phase" text,
	"block_type" text,
	"effort" text,
	"unit" text
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_weeks" ADD CONSTRAINT "training_weeks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_zones" ADD CONSTRAINT "training_zones_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_logs" ADD CONSTRAINT "workout_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_logs" ADD CONSTRAINT "workout_logs_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_training_week_id_training_weeks_id_fk" FOREIGN KEY ("training_week_id") REFERENCES "public"."training_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_blocks" ADD CONSTRAINT "workout_blocks_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;