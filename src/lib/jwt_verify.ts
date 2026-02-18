import * as jose from "jose";

const secret = Deno.env.get("JWT_SECRET");
if (!secret) throw new Error("JWT_SECRET is not set");

const key = new TextEncoder().encode(secret);

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, key);
    return payload; // { session_id, role, exp, ... }
  } catch {
    return null;
  }
}
