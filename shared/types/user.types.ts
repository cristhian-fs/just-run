export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  weightKg: number | null;
  heightCm: number | null;
  hasCompleteOnboarding: boolean;
};
