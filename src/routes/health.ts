import { Hono } from "hono";

export const healthRoutes = new Hono();

healthRoutes.get("/healthz", (c) => {
  return c.json({
    ok: true,
    service: "zyrentis-api",
    ts: new Date().toISOString(),
  });
});