CREATE TABLE "workout_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_id" text NOT NULL,
	"order" integer NOT NULL,
	"type" text NOT NULL,
	"vam_intensity" numeric,
	"target_zone" integer,
	"pace" text,
	"distance_km" numeric,
	"duration_min" numeric,
	"description" text,
	"block_type" text,
	"effort" text,
	"unit" text
);
--> statement-breakpoint
ALTER TABLE "workout_blocks" ADD CONSTRAINT "workout_blocks_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;