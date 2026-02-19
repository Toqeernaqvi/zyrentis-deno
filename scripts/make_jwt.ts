import { signSessionJwt } from "../src/lib/jwt.ts";

const sessionId = Deno.args[0] ?? "test-session-1";
const role = Deno.args[1] ?? "candidate";

try {
  const token = await signSessionJwt({ session_id: sessionId, role }, "2h");
  console.log(token);
} catch (err) {
  console.error("Error creating token:", err.message ?? err);
  Deno.exit(1);
}
