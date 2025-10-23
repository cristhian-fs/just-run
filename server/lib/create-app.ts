import { Hono } from "hono";
import { logger } from "hono/logger";

import { parseEnv } from "@/env";

import authCors from "../middlewares/auth-cors";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";
import withSession from "../middlewares/with-session";
import { auth } from "./auth";
import type { Context } from "./context";

export function createRouter() {
	return new Hono<Context>();
}

export default function createApp() {
	const app = createRouter();
	app.use(logger());

	app.use((c, next) => {
		c.env = parseEnv(Object.assign(c.env || {}, process.env));
		return next();
	});

	app.use("/api/auth/*", authCors);
	// Middleware para verificar sessão APÓS o CORS
	app.use("*", withSession);
	// Rota de autenticação
	app.on(["POST", "GET"], "/api/auth/*", (c) => {
		return auth.handler(c.req.raw);
	});
	app.onError(onError);
	app.notFound(notFound);
	return app;
}
