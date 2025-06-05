import type { Env } from "hono";

import type { Enviroment } from "@/env";

import { auth } from "./auth";

export interface Context extends Env {
  Bindings: Enviroment;
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}
