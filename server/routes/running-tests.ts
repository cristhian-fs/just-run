import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { tests } from "@/db/schemas";
import { loggedIn } from "@/middlewares/logged-in";

import { type SuccessResponse, type Test } from "@/shared/types";
import type { Context } from "@/lib/context";

export const runningTestsRouter = new Hono<Context>()
  .get("/", loggedIn, async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new Error("User not found");
    }

    const { id } = user;

    const runningTests = await db.query.tests.findMany({
      where: eq(tests.userId, id),
      orderBy: (tests, { desc }) => desc(tests.testDate),
    });

    return c.json<SuccessResponse<Test[]>>({
      success: true,
      message: "Testes de corrida obtidos com sucesso",
      data: runningTests,
    });
  })
  .delete("/:id", loggedIn, async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new Error("User not found");
    }

    const { id: testId } = c.req.param();

    await db.delete(tests).where(eq(tests.id, testId));

    return c.json<SuccessResponse>({
      success: true,
      message: "Teste de corrida excluído com sucesso",
    });
  });
