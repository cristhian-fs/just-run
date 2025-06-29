CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."training_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."goal_type" AS ENUM('startRunning', 'improveHealth', 'loseWeight', 'runFaster', 'runLonger', 'race5K', 'race10K', 'race21K', 'race42K');--> statement-breakpoint
CREATE TYPE "public"."test_type" AS ENUM('1600m', '2400m', '3200m', '3000m', '5000m');--> statement-breakpoint
CREATE TYPE "public"."traning_type" AS ENUM('EASY_RUN', 'LONG_RUN', 'INTERVAL', 'FARTLEK', 'PROGRESSIVE_RUN', 'REPETITION', 'RECOVERY_RUN', 'THRESHOLD_RUN');--> statement-breakpoint
CREATE TYPE "public"."week_type" AS ENUM('INTRO', 'TEST', 'BASE', 'BUILD', 'PEAK', 'TAPER', 'DELOAD', 'COMPETITION');--> statement-breakpoint
CREATE TYPE "public"."segment_kind" AS ENUM('WORK', 'REST', 'FLOAT', 'THRESHOLD', 'PROGRESSIVE', 'WARMUP', 'COOLDOWN');--> statement-breakpoint
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
	"user_gender" "user_gender",
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
	"scheduled_start" date NOT NULL,
	"run_type" "traning_type" NOT NULL,
	"title" text,
	"notes" text,
	"planned_distance_m" integer,
	"planned_duration_s" integer,
	"actual_distance_m" integer,
	"actual_duration_s" integer,
	"avg_pace_s_per_km" integer,
	"avg_hr" integer,
	"elevation_gain_m" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"block_kind" "segment_kind" NOT NULL,
	"repeat_count" integer DEFAULT 1 NOT NULL,
	"order_index" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "segment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid,
	"block_id" uuid,
	"order_in_block" integer NOT NULL,
	"segment_kind" "segment_kind" NOT NULL,
	"planned_distance_m" integer,
	"planned_duration_s" integer,
	"target_pace_s_per_km" integer,
	"target_hr" integer,
	"rest_distance_m" integer,
	"rest_duration_s" integer,
	"actual_distance_m" integer,
	"actual_duration_s" integer,
	"avg_pace_s_per_km" integer,
	"avg_hr" integer,
	"notes" text
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
ALTER TABLE "block" ADD CONSTRAINT "block_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "segment" ADD CONSTRAINT "segment_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "segment" ADD CONSTRAINT "segment_block_id_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."block"("id") ON DELETE cascade ON UPDATE no action;