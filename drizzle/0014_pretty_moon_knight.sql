CREATE TYPE "public"."pace_reference" AS ENUM('V1500', 'V3000', 'V5000', 'V10000', 'V15000', 'HMP', 'MP', 'LT', 'EASY');--> statement-breakpoint
ALTER TABLE "plan_segments" ADD COLUMN "target_pace_reference" "pace_reference";--> statement-breakpoint
ALTER TABLE "plan_segments" ADD COLUMN "pace_offset_s_per_km" integer;