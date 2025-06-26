import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db";
import * as schema from "../db/schemas/auth";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET || undefined,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      weightKg: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      heightCm: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      hasCompleteOnboarding: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      gender: {
        type: "string",
        required: false,
        defaultValue: "male",
      },
      age: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
    },
  },
  socialProviders: {
    // github: {
    //   clientId: process.env.DISCORD_CLIENT_ID as string,
    //   clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    // },
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // },
  },
  advanced: {
    cookiePrefix: "better-auth",
  },
  trustedOrigins: [process.env.CORS_ORIGIN || "http://localhost:5173"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
});
