ALTER TYPE "public"."user_gender" RENAME TO "gender";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "user_gender" TO "gender";