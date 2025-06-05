import { z } from "zod";

import type { ApiRoutes } from "../server";

export { type ApiRoutes };

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

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

export type User = {
  email: string;
  id: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};
