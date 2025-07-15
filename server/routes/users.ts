import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  goal as goalTable,
  tests,
  trainingZones as trainingZonesTable,
} from "@/db/schemas";
import { user } from "@/db/schemas/auth";
import { loggedIn } from "@/middlewares/logged-in";
import { zValidator } from "@hono/zod-validator";

import { TestFormSchema, userBasicSettingsSchema } from "@/shared/schemas";
import {
  type ErrorResponse,
  type SuccessResponse,
  type Test,
  type User,
} from "@/shared/types";
import type { Context } from "@/lib/context";
import { generateTest } from "@/lib/core/generators/test-generator";
import { formatDate } from "@/lib/utils";

export const userRouter = new Hono<Context>()
  .get("/", loggedIn, async (c) => {
    const users = await db.select().from(user);

    return c.json<SuccessResponse<User[]>>(
      {
        success: true,
        message: "Fecht users successfully",
        data: users as User[],
      },
      200,
    );
  })
  .get("/last-test", loggedIn, async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new Error("User not found");
    }

    const test = await db.query.tests.findFirst({
      where: eq(tests.userId, user.id),
      orderBy: (tests, { desc }) => desc(tests.testDate),
    });

    return c.json<SuccessResponse<Test>>(
      {
        success: true,
        message: "Test fetched successfully",
        data: test as Test,
      },
      200,
    );
  })
  .post(
    "/update-profile",
    loggedIn,
    zValidator("form", userBasicSettingsSchema),
    async (c) => {
      const userContext = c.get("user");

      if (!userContext) {
        throw new Error("User not found");
      }
      const { age, email, gender, heightCm, name, weightKg, trainingLevel } =
        c.req.valid("form");

      await db
        .update(user)
        .set({
          age,
          email,
          gender,
          heightCm,
          name,
          weightKg,
          trainingLevel,
        })
        .where(eq(user.id, userContext.id));

      return c.json<SuccessResponse>(
        {
          success: true,
          message: "User updated successfully",
        },
        200,
      );
    },
  )
  .post(
    "/add-test",
    loggedIn,
    zValidator("form", TestFormSchema),
    async (c) => {
      const userContext = c.get("user");

      if (!userContext) {
        throw new Error("User not found");
      }

      const { id } = userContext;

      const form = c.req.valid("form");

      const currentUserData = await db.query.user.findFirst({
        where: eq(user.id, id),
      });

      if (!currentUserData || !currentUserData.age) {
        return c.json<ErrorResponse>({
          success: false,
          error: "Preencha os dados de perfil antes de adicionar um teste",
        });
      }

      const generatedTest = generateTest({
        userAge: currentUserData.age,
        testData: form,
      });

      const raceDate = ["race5K", "race10K", "race21K", "race42K"].includes(
        form.goal,
      )
        ? formatDate(new Date(form.raceDate!))
        : null;

      await db.transaction(async (tx) => {
        const { trainingZones } = generatedTest;

        await tx.insert(goalTable).values({
          userId: id,
          createdAt: new Date(),
          goalType: form.goal,
          eventDate: raceDate,
          weeklyFrequency: form.weeklyFrequency,
        });

        await tx.insert(tests).values({
          userId: id,
          paceMinKm: generatedTest.paceMinKm,
          durationS: generatedTest.durationS,
          testType: form.testType,
          distanceM: generatedTest.distanceM,
          vam: generatedTest.vam,
          fcmax: generatedTest.fcmax,
          vo2Max: generatedTest.vo2Max,
          vo2: generatedTest.vo2,
          testDate: formatDate(new Date(form.testDate)),
        });

        await tx
          .delete(trainingZonesTable)
          .where(eq(trainingZonesTable.userId, id));

        trainingZones.map(async (zone) => {
          await tx.insert(trainingZonesTable).values({
            userId: id,
            name: zone.name,
            cardioFrequency: zone.cardioFrequency,
            pace: zone.pace,
            velocity: zone.velocity,
            vo2Max: zone.vo2Max,
            vo2Percentage: zone.vo2Percentage,
            workouts: zone.workouts,
            createdAt: new Date(),
          });
        });

        await tx
          .update(user)
          .set({
            hasCompleteOnboarding: true,
          })
          .where(eq(user.id, id));
      });

      return c.json({
        success: true,
        message: "Test added successfully",
        data: generatedTest,
      });
    },
  );
