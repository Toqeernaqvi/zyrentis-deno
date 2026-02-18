import type { Context } from "hono";

export const errorHandler = (err: unknown, c: Context) => {
  // Zod validation errors show as Error with message, we keep it simple for Day 1
  console.error("ERROR:", err);

  return c.json(
    {
      code: "INTERNAL_ERROR",
      message: err instanceof Error ? err.message : "Unknown error",
    },
    500,
  );
};
