import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(3).max(255),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9]+$/),
  email: z.string(),
  password: z.string().min(3).max(255),
});
