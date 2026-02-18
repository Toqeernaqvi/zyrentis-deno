import { Hono } from "hono";
import { z } from "zod";
import { sql } from "../lib/db.ts";
import { signSessionJwt } from "../lib/jwt.ts";

export const authRoutes = new Hono();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = LoginSchema.parse(body);

  // DEV ONLY: password is hard-coded
  // Day 2: Replace with DB lookup + bcrypt/argon2
  if (password !== "admin") {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  // DEV ONLY token
  return c.json({
    token: "dev.jwt.token",
    user: { email, role: "admin" },
  });
});

authRoutes.post("/exchange-invite", async (c) => {
  const body = await c.req.json();
  const invite_token = String(body.invite_token ?? "");

  if (!invite_token || invite_token.length < 10) {
    return c.json({ message: "Invalid invite token" }, 400);
  }

  const rows = await sql`
    SELECT id, status FROM sessions WHERE invite_token = ${invite_token}
  `;
  if (rows.length === 0) return c.json({ message: "Invalid token" }, 400);

  const session_id = rows[0].id as string;

  // Mark active if not already
  await sql`
    UPDATE sessions
    SET status = 'active', started_at = COALESCE(started_at, now())
    WHERE id = ${session_id}
  `;

  const session_token = await signSessionJwt(
    { role: "candidate", session_id },
    "2h",
  );
  return c.json({ session_token });
});
