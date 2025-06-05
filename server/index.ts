import { serveStatic } from "hono/bun";

import createApp from "./lib/create-app";
import { userRouter } from "./routes/users";

const app = createApp();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.basePath("/api").route("/users", userRouter);

app.get("*", serveStatic({ root: "./frontend/dist/" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

// IMPORTANT: Development mode, export the app
export default app;

// IMPORTANT: Production mode, export the below
// export default {
//   port: process.env.PORT || 3000,
//   hostname: "0.0.0.0",
//   fetch: app.fetch,
// };

console.log("Server Running on port", process.env["PORT"] || 3000);
export type ApiRoutes = typeof routes;
