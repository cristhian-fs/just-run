ALTER TABLE "segment" RENAME TO "segments";--> statement-breakpoint
ALTER TABLE "block" RENAME TO "blocks";--> statement-breakpoint
ALTER TABLE "blocks" DROP CONSTRAINT "block_workout_id_workouts_id_fk";
--> statement-breakpoint
ALTER TABLE "segments" DROP CONSTRAINT "segment_workout_id_workouts_id_fk";
--> statement-breakpoint
ALTER TABLE "segments" DROP CONSTRAINT "segment_block_id_block_id_fk";
--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "segments" ADD CONSTRAINT "segments_block_id_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;