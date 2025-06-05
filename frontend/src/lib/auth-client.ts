import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    import.meta.env.NODE_ENV === "production"
      ? import.meta.env.VITE_APP_URL
      : import.meta.env.VITE_SERVER_URL,
});
