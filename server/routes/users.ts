import { Hono } from "hono";

import { db } from "@/db";
import { user } from "@/db/schemas/auth";
import { loggedIn } from "@/middlewares/logged-in";

import { type SuccessResponse, type User } from "@/shared/types";
import type { Context } from "@/lib/context";

export const userRouter = new Hono<Context>().get("/", loggedIn, async (c) => {
  const users = await db.select().from(user);

  return c.json<SuccessResponse<User[]>>(
    {
      success: true,
      message: "Fecht users successfully",
      data: users as User[],
    },
    200,
  );
});
