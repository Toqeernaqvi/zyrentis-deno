import { Hono } from "hono";

import { logger } from "./src/middlewares/logger.ts";
import { errorHandler } from "./src/middlewares/error.ts";
import { healthRoutes } from "./src/routes/health.ts";
import { authRoutes } from "./src/routes/auth.ts";

import { interviewRoutes } from "./src/routes/interviews.ts";
import { sessionRoutes } from "./src/routes/sessions.ts";

import { handleWs } from "./src/ws/handler.ts";
import { cors } from "hono/cors";

import { rateLimit } from "./src/middlewares/ratelimit.ts";

const app = new Hono();

// middlewares
app.use("*", logger);

// 30 req/min: sessions + invite exchange
app.use(
  "/api/sessions",
  rateLimit({ windowSeconds: 60, max: 30, keyPrefix: "rl:sessions" }),
);

app.use(
  "/api/auth/exchange-invite",
  rateLimit({ windowSeconds: 60, max: 30, keyPrefix: "rl:exchange" }),
);

// interviews creation - slightly stricter
app.use(
  "/api/interviews",
  rateLimit({ windowSeconds: 60, max: 20, keyPrefix: "rl:interviews" }),
);

app.onError(errorHandler);

// routes
app.route("/", healthRoutes);
app.route("/api/auth", authRoutes);

app.route("/api/interviews", interviewRoutes);
app.route("/api/sessions", sessionRoutes);

// Start server
Deno.serve({ port: Number(Deno.env.get("PORT") ?? 8000) }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/ws") {
    return await handleWs(req);
  }

  return app.fetch(req);
});

app.use(
  "/api/*",
  cors({
    origin: [
      "http://localhost:3000", // common React/Next dev
      "http://localhost:8000", // your current origin in the error
      "https://zyrentis-deno.codewithnaqvi.deno.net",
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);
