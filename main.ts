import { Hono } from "hono";

import { logger } from "./src/middlewares/logger.ts";
import { errorHandler } from "./src/middlewares/error.ts";
import { healthRoutes } from "./src/routes/health.ts";
import { authRoutes } from "./src/routes/auth.ts";

import { interviewRoutes } from "./src/routes/interviews.ts";
import { sessionRoutes } from "./src/routes/sessions.ts";

const app = new Hono();

// middlewares
app.use("*", logger);
app.onError(errorHandler);

// routes
app.route("/", healthRoutes);
app.route("/api/auth", authRoutes);

app.route("/api/interviews", interviewRoutes);
app.route("/api/sessions", sessionRoutes);

// Start server
Deno.serve({ port: Number(Deno.env.get("PORT") ?? 8000) }, app.fetch);
