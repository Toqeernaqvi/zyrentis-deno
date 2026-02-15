import type { MiddlewareHandler } from "hono";

export const logger: MiddlewareHandler = async (c, next) => {
  const start = performance.now();
  await next();
  const ms = Math.round(performance.now() - start);

  console.log(
    JSON.stringify({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      ms,
    }),
  );
};