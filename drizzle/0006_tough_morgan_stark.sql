CREATE TYPE "public"."level" AS ENUM('beginner', 'intermediate', 'advanced', 'elite');--> statement-breakpoint
ALTER TYPE "public"."segment_kind" ADD VALUE 'INTERVAL';--> statement-breakpoint
ALTER TYPE "public"."segment_kind" ADD VALUE 'REPETITION';--> statement-breakpoint
ALTER TYPE "public"."segment_kind" ADD VALUE 'RECOVERY';--> statement-breakpoint
ALTER TYPE "public"."segment_kind" ADD VALUE 'MARATHON';--> statement-breakpoint
ALTER TYPE "public"."segment_kind" ADD VALUE 'WALK';--> statement-breakpoint
ALTER TYPE "public"."traning_type" ADD VALUE 'REST';--> statement-breakpoint
CREATE TABLE "active_plans" (
	"user_id" text NOT NULL,
	"plan_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"block_kind" "segment_kind" NOT NULL,
	"repeat_count" integer DEFAULT 1 NOT NULL,
	"order_index" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "plan_segments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid,
	"block_id" uuid,
	"order_in_block" integer NOT NULL,
	"segment_kind" "segment_kind" NOT NULL,
	"planned_distance_m" integer,
	"planned_duration_s" integer,
	"target_pace_s_per_km" integer,
	"target_hr" integer
);
--> statement-breakpoint
CREATE TABLE "plan_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"week_number" integer NOT NULL,
	"total_volume_min" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_week_id" uuid NOT NULL,
	"run_type" "traning_type" NOT NULL,
	"title" text,
	"notes" text,
	"planned_distance_m" integer,
	"planned_duration_s" integer
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"level" "level" NOT NULL,
	"description" text,
	"coach" text,
	"weekly_volume" integer NOT NULL,
	"total_weeks" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid,
	"user_id" text NOT NULL,
	"completed_at" date NOT NULL,
	"analytics_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "active_plans" ADD CONSTRAINT "active_plans_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_plans" ADD CONSTRAINT "active_plans_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_blocks" ADD CONSTRAINT "plan_blocks_workout_id_plan_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."plan_workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_segments" ADD CONSTRAINT "plan_segments_workout_id_plan_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."plan_workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_segments" ADD CONSTRAINT "plan_segments_block_id_plan_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."plan_blocks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_weeks" ADD CONSTRAINT "plan_weeks_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_workouts" ADD CONSTRAINT "plan_workouts_plan_week_id_plan_weeks_id_fk" FOREIGN KEY ("plan_week_id") REFERENCES "public"."plan_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_analytics" ADD CONSTRAINT "workout_analytics_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;