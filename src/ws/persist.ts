import { redis } from "../lib/redis.ts";

const keyFor = (sessionId: string) => `sess:${sessionId}:doc`;

export async function loadDoc(sessionId: string) {
  const raw = await redis.get<string>(keyFor(sessionId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      version: number;
      docByFile: Record<string, string>;
    };
  } catch {
    return null;
  }
}

export async function saveDoc(
  sessionId: string,
  version: number,
  docByFile: Record<string, string>,
) {
  const payload = JSON.stringify({ version, docByFile });
  // Keep for 24h (tune later)
  await redis.set(keyFor(sessionId), payload, { ex: 60 * 60 * 24 });
}
