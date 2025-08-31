ALTER TABLE "plan_segments" DROP CONSTRAINT "plan_segments_block_id_plan_blocks_id_fk";
--> statement-breakpoint
ALTER TABLE "plan_segments" ADD CONSTRAINT "plan_segments_block_id_plan_blocks_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."plan_blocks"("id") ON DELETE cascade ON UPDATE no action;