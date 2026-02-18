import * as jose from "jose";

const secret = Deno.env.get("JWT_SECRET");
if (!secret) throw new Error("JWT_SECRET is not set");

const key = new TextEncoder().encode(secret);

export async function signSessionJwt(
  payload: Record<string, unknown>,
  expiresIn: string = "2h",
) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}
