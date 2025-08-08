import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL:
		import.meta.env.NODE_ENV === "production"
			? import.meta.env.VITE_APP_URL
			: import.meta.env.AUTH_BASE_URL,
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
				age: {
					type: "number",
				},
			},
		}),
	],
});

export type Session = typeof authClient.$Infer.Session;
