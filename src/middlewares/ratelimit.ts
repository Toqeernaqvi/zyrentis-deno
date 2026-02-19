import type { MiddlewareHandler } from "hono";
import { redis } from "../lib/redis.ts";

type IdSelector = (req: Request) => string;

// Get IP safely in Deno Deploy / proxies
function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Fixed-window Redis rate limiter (Upstash)
 * - windowSeconds: length of window
 * - max: max requests per window
 * - keyPrefix: namespacing (e.g., "rl:sessions")
 * - id: choose identifier strategy (IP by default; can be session_id, apiKey, etc.)
 */
export function rateLimit(options: {
  windowSeconds: number;
  max: number;
  keyPrefix: string;
  id?: IdSelector;
}): MiddlewareHandler {
  const { windowSeconds, max, keyPrefix, id } = options;

  return async (c, next) => {
    const req = c.req.raw;
    const identifier = (id ?? ((r) => getClientIp(r)))(req);

    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (now % windowSeconds);
    const key = `${keyPrefix}:${identifier}:${windowStart}`;

    // increment counter
    const count = await redis.incr(key);

    // set expiration only on first hit
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    // Add useful headers
    c.header("X-RateLimit-Limit", String(max));
    c.header("X-RateLimit-Remaining", String(Math.max(0, max - count)));
    c.header("X-RateLimit-Reset", String(windowStart + windowSeconds));

    if (count > max) {
      return c.json(
        { message: "Too many requests, please try again later." },
        429,
      );
    }

    await next();
  };
}
