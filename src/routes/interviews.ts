import { Hono } from "hono";
import { z } from "zod";
import { sql } from "../lib/db.ts";

export const interviewRoutes = new Hono();

const CreateInterview = z.object({
  title: z.string().min(3),
  difficulty_tier: z.number().int().min(1).max(4),
  duration_minutes: z.number().int().min(15).max(180),
});

interviewRoutes.post("/", async (c) => {
  const body = CreateInterview.parse(await c.req.json());
  const id = crypto.randomUUID();

  await sql`
    INSERT INTO interviews (id, title, difficulty_tier, duration_minutes)
    VALUES (${id}, ${body.title}, ${body.difficulty_tier}, ${body.duration_minutes})
  `;

  return c.json({ id, ...body }, 201);
});

interviewRoutes.get("/", async (c) => {
  const rows = await sql`
    SELECT id, title, difficulty_tier, duration_minutes, created_at
    FROM interviews
    ORDER BY created_at DESC
  `;
  return c.json(rows);
});
