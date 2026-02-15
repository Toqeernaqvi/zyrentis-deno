# zyrentis-deno

A minimal Deno + Hono example API with basic routes, middleware, and tests — perfect for demos and small services.

---

## 🚀 Quick start

Prerequisites: [Deno](https://deno.land) installed.

1. Clone the repo

   ```bash
   git clone <repo-url>
   cd zyrentis-deno
   ```

2. Run in development mode (auto-reload):

   ```bash
   deno task dev
   ```

3. Open the API:

   - Health: `GET http://localhost:8000/healthz`
   - Login: `POST http://localhost:8000/api/auth/login`

> The server reads `PORT` from the environment (default: `8000`).

---

## ⚙️ Available tasks

- `deno task dev` — run the app with file-watch
- `deno task fmt` — format code
- `deno task lint` — lint the codebase
- `deno task check` — type-check the project
- `deno test` — run unit tests

---

## 🧩 Endpoints

- `GET /healthz` — service health and timestamp
  - Response: `{ ok: true, service: string, ts: string }`

- `POST /api/auth/login` — simple login (DEV ONLY)
  - Body: `{ "email": string, "password": string }
  - DEV behavior: accepts only `password: "admin"` and returns a fake token

Example curl (login):

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"me@example.com","password":"admin"}'
```

---

## 🧪 Tests

Run:

```bash
deno test
```

The repo includes a small unit test for `add()` located in `main_test.ts`.

---

## 🗂 Project structure

- `main.ts` — application entrypoint
- `src/routes/` — route modules (`health`, `auth`)
- `src/middlewares/` — middlewares (logger, error handler)
- `main_test.ts` — unit tests

---

## ⚠️ Notes & TODOs

- Authentication is stubbed for development — replace with real user store and password hashing before production.
- Replace the hard-coded token with a real JWT implementation.

---

## 🙏 Contributing

PRs and issues are welcome. Keep changes focused and add tests for new behavior.

---

## 📄 License

MIT
