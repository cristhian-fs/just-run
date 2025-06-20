import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    import.meta.env.NODE_ENV === "production"
      ? import.meta.env.VITE_APP_URL
      : import.meta.env.VITE_SERVER_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        weightKg: {
          type: "number",
        },
        heightCm: {
          type: "number",
        },
        hasCompleteOnboarding: {
          type: "boolean",
        },
        gender: {
          type: "string",
        },
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
