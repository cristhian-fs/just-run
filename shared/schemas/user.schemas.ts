import { z } from "zod";

export const userBasicSettingsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().min(0).max(120),
  weightKg: z.coerce
    .number()
    .min(0, { message: "O peso é obrigatório" })
    .max(300),
  heightCm: z.coerce
    .number()
    .min(0, { message: "A altura é obrigatória" })
    .max(300),
  trainingLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

export type UserBasicSettingsData = z.infer<typeof userBasicSettingsSchema>;
