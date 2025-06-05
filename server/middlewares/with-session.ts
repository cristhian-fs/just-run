import type { MiddlewareHandler } from "hono";

import { auth } from "../lib/auth";
import type { Context } from "../lib/context";

const withSession: MiddlewareHandler<Context> = async (c, next) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
  } catch (error) {
    console.error("Session error:", error);
    c.set("user", null);
    c.set("session", null);
  }
  return next();
};

export default withSession;
