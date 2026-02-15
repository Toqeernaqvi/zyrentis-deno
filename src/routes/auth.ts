import { Hono } from "hono";
import { z } from "zod";

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