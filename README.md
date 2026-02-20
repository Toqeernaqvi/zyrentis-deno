# zyrentis-deno

Deno + Hono backend for real-time coding interviews.

## Prerequisites

- Deno 2+
- Neon Postgres database
- Upstash Redis

## Environment variables

Create `.env` in the project root:

```env
PORT=8000
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## Setup

1. Install dependencies (if needed for local Node tooling):

```bash
npm install
```

2. Initialize database tables:

```bash
deno run -A --env-file=.env scripts/init_db.ts
```

3. Start the API in watch mode:

```bash
deno task dev
```

Server default: `http://localhost:8000`

## Available tasks

- `deno task dev` - run server with watch mode
- `deno task fmt` - format code
- `deno task lint` - lint code
- `deno task check` - type-check entrypoint
- `deno test` - run tests

## Routes

### HTTP

1. `GET /`
- Returns a landing HTML page with API info.

2. `GET /healthz`
- Health check endpoint.
- Response example:

```json
{
  "ok": true,
  "service": "zyrentis-api",
  "ts": "2026-02-20T00:00:00.000Z"
}
```

3. `POST /api/auth/login`
- DEV login endpoint.
- Body:

```json
{
  "email": "me@example.com",
  "password": "admin"
}
```

- Notes:
- `password` must be `admin` (dev-only behavior).
- Returns `401` for invalid credentials.

4. `POST /api/auth/exchange-invite`
- Exchanges an invite token for a session JWT.
- Body:

```json
{
  "invite_token": "token-from-session-create"
}
```

- Returns `400` for invalid token input.

5. `POST /api/interviews`
- Creates an interview.
- Body:

```json
{
  "title": "Array & String Debugging",
  "difficulty_tier": 2,
  "duration_minutes": 45
}
```

- Validation:
- `title`: min 3 chars
- `difficulty_tier`: integer 1-4
- `duration_minutes`: integer 15-180

6. `GET /api/interviews`
- Returns interview list sorted by newest first.

7. `POST /api/sessions`
- Creates a candidate session and invite token.
- Body:

```json
{
  "interview_id": "uuid",
  "candidate_email": "candidate@example.com",
  "candidate_name": "Alex"
}
```

- Behavior:
- Upserts candidate by email.
- Creates session record.
- Returns `201` with `session_id` and `invite_token`.

### WebSocket

1. `GET /ws?token=<JWT>` (WebSocket upgrade)
- Requires valid JWT (`session_id` in payload).
- On connect, server sends:
- `state_snapshot` with persisted `docByFile` and `version`.
- Accepts client message:

```json
{
  "type": "code_sync",
  "payload": {
    "file": "main.py",
    "content": "print('hello')"
  }
}
```

- Broadcasts `code_sync` updates to the room.

## Rate limits

Applied with Redis fixed-window limiter:

- `/api/sessions`: 30 requests/minute
- `/api/auth/exchange-invite`: 30 requests/minute
- `/api/interviews`: 20 requests/minute

Response headers include:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## CORS

Allowed origins for `/api/*`:

- `http://localhost:3000`
- `http://localhost:8000`
- `https://zyrentis-deno.codewithnaqvi.deno.net`

Allowed methods: `GET`, `POST`, `OPTIONS`

## Useful scripts

Generate a session JWT:

```bash
deno run -A --env-file=.env scripts/make_jwt.ts <session_id> <role>
```

WebSocket smoke test:

```bash
deno run -A --env-file=.env scripts/ws_test.ts <jwt_token>
```

## Curl examples

Set a base URL first:

```bash
BASE_URL=http://localhost:8000
```

Health check:

```bash
curl "$BASE_URL/healthz"
```

DEV login:

```bash
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"admin"}'
```

Create interview:

```bash
curl -X POST "$BASE_URL/api/interviews" \
  -H "Content-Type: application/json" \
  -d '{"title":"Array & String Debugging","difficulty_tier":2,"duration_minutes":45}'
```

List interviews:

```bash
curl "$BASE_URL/api/interviews"
```

Create session (replace `<INTERVIEW_ID>`):

```bash
curl -X POST "$BASE_URL/api/sessions" \
  -H "Content-Type: application/json" \
  -d '{"interview_id":"<INTERVIEW_ID>","candidate_email":"candidate@example.com","candidate_name":"Alex"}'
```

Exchange invite token (replace `<INVITE_TOKEN>`):

```bash
curl -X POST "$BASE_URL/api/auth/exchange-invite" \
  -H "Content-Type: application/json" \
  -d '{"invite_token":"<INVITE_TOKEN>"}'
```

WebSocket smoke test (replace `<SESSION_ID>`):

```bash
TOKEN=$(deno run -A --env-file=.env scripts/make_jwt.ts <SESSION_ID> candidate)
deno run -A --env-file=.env scripts/ws_test.ts "$TOKEN"
```
## Quick API flow

1. `POST /api/interviews` to create interview
2. `POST /api/sessions` to create session + invite token
3. `POST /api/auth/exchange-invite` to get `session_token`
4. Connect WebSocket to `/ws?token=<session_token>`

## Project structure

- `main.ts` - app entrypoint
- `src/routes/` - HTTP routes
- `src/ws/` - websocket room and persistence logic
- `src/middlewares/` - logger, error handler, rate limiter
- `src/lib/` - DB, Redis, JWT helpers
- `scripts/init_db.ts` - create required DB tables
- `scripts/make_jwt.ts` - helper for creating session JWTs
- `scripts/ws_test.ts` - helper websocket test client



