import { z } from "zod";

import { onboardingSchema } from "@/shared/schemas/onboarding.schemas";

export type TOnboarding = z.infer<typeof onboardingSchema>;
