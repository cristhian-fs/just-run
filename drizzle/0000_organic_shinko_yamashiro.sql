CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."goal_type" AS ENUM('5K', '10K', '21K', '42K');--> statement-breakpoint
CREATE TYPE "public"."test_type" AS ENUM('3K', '5K', '6K', '10K', '21K');--> statement-breakpoint
CREATE TYPE "public"."traning_type" AS ENUM('EASY_RUN', 'LONG_RUN', 'INTERVAL', 'FARTLEK', 'PROGRESSIVE_RUN', 'REPETITION', 'RECOVERY_RUN');--> statement-breakpoint
CREATE TYPE "public"."week_type" AS ENUM('BASE', 'BUILD', 'PEAK', 'DELOAD');--> statement-breakpoint
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
	"gender" "gender",
	"weight_kg" numeric,
	"height_cm" numeric,
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
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"goal_type" "goal_type" NOT NULL,
	"target_time" time NOT NULL,
	"event_date" date NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"test_type" "test_type" NOT NULL,
	"distance_m" integer NOT NULL,
	"duration_s" integer NOT NULL,
	"pace_min_km" numeric,
	"test_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_weeks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"week_start" date NOT NULL,
	"week_type" "week_type" NOT NULL,
	"total_volume_min" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_zones" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"vam_kmh" numeric NOT NULL,
	"zone_1_min" numeric NOT NULL,
	"zone_1_max" numeric NOT NULL,
	"zone_2_min" numeric NOT NULL,
	"zone_2_max" numeric NOT NULL,
	"zone_3_min" numeric NOT NULL,
	"zone_3_max" numeric NOT NULL,
	"zone_4_min" numeric NOT NULL,
	"zone_4_max" numeric NOT NULL,
	"zone_5_min" numeric NOT NULL,
	"zone_5_max" numeric NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"workout_id" text NOT NULL,
	"actual_time_s" integer NOT NULL,
	"actual_distance_m" integer NOT NULL,
	"perceived_effort" integer NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" text PRIMARY KEY NOT NULL,
	"training_week_id" text NOT NULL,
	"date" date NOT NULL,
	"type" "traning_type" NOT NULL,
	"description" text,
	"intensity_zone" integer,
	"duration_min" integer NOT NULL,
	"duration_km" numeric,
	"is_completed" boolean NOT NULL,
	CONSTRAINT "intensity_zone" CHECK ("workouts"."intensity_zone" >= 1 and "workouts"."intensity_zone" <= 10)
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
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_training_week_id_training_weeks_id_fk" FOREIGN KEY ("training_week_id") REFERENCES "public"."training_weeks"("id") ON DELETE cascade ON UPDATE no action;