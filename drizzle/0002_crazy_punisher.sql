ALTER TYPE "public"."traning_type" ADD VALUE 'THRESHOLD_RUN' BEFORE 'RECOVERY_RUN';--> statement-breakpoint
CREATE TABLE "workout_reps" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_id" text NOT NULL,
	"order" integer NOT NULL,
	"distance_km" numeric NOT NULL,
	"duration_min" numeric,
	"target_zone" integer,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "warmup_km" numeric;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "cooldown_km" numeric;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "rest_between_reps_min" numeric;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "total_reps" integer;--> statement-breakpoint
ALTER TABLE "workout_reps" ADD CONSTRAINT "workout_reps_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;