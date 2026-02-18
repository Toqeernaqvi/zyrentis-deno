import { Hono } from "hono";
import { z } from "zod";
import { sql } from "../lib/db.ts";

export const sessionRoutes = new Hono();

const CreateSession = z.object({
  interview_id: z.string().uuid(),
  candidate_email: z.string().email(),
  candidate_name: z.string().min(2),
});

sessionRoutes.post("/", async (c) => {
  const body = CreateSession.parse(await c.req.json());

  // Upsert candidate
  const newCandId = crypto.randomUUID();
  await sql`
    INSERT INTO candidates (id, email, name)
    VALUES (${newCandId}, ${body.candidate_email}, ${body.candidate_name})
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  `;

  const candidateRows = await sql`
    SELECT id FROM candidates WHERE email = ${body.candidate_email}
  `;
  const candidate_id = candidateRows[0].id as string;

  const session_id = crypto.randomUUID();
  const invite_token = crypto.randomUUID().replaceAll("-", "");

  await sql`
    INSERT INTO sessions (id, interview_id, candidate_id, invite_token)
    VALUES (${session_id}, ${body.interview_id}, ${candidate_id}, ${invite_token})
  `;

  return c.json({ session_id, invite_token }, 201);
});
