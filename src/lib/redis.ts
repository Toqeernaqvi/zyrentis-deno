import { Redis } from "upstash";

// Works on Deno Deploy by reading UPSTASH_REDIS_REST_URL/TOKEN from env
export const redis = Redis.fromEnv();
