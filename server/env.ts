import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string().url(),
  CORS_ORIGIN: z.string().url(),
  DB_PORT: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

export type Enviroment = z.infer<typeof EnvSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseEnv(data: any) {
  const { data: env, error } = EnvSchema.safeParse(data);

  if (error) {
    const errorMessage = `error: invalid env: \n${Object.entries(
      error.flatten().fieldErrors,
    )
      .map(([key, errors]) => `${key}: ${errors.join(", ")}`)
      .join("\n")}`;

    throw new Error(errorMessage);
  }

  return env;
}
