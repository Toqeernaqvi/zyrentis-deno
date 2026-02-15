import { Hono } from "hono";

import { logger } from "./src/middlewares/logger.ts";
import { errorHandler } from "./src/middlewares/error.ts";
import { healthRoutes } from "./src/routes/health.ts";
import { authRoutes } from "./src/routes/auth.ts";

const app = new Hono();

// middlewares
app.use("*", logger);
app.onError(errorHandler);

// routes
app.route("/", healthRoutes);
app.route("/api/auth", authRoutes);

// Start server
Deno.serve({ port: Number(Deno.env.get("PORT") ?? 8000) }, app.fetch);
