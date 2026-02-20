import { Hono } from "hono";
import { html } from "hono/html";

export const healthRoutes = new Hono();

const indexHtml = html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Zyrentis API</title>
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap");

        :root {
          --bg-0: #060b16;
          --bg-1: #0c1730;
          --panel: rgba(12, 20, 40, 0.74);
          --panel-border: rgba(116, 198, 255, 0.18);
          --text: #e6f2ff;
          --muted: #8ea8c7;
          --brand: #38bdf8;
          --brand-strong: #06b6d4;
          --accent: #2dd4bf;
          --ok: #22c55e;
          --shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
          --radius-lg: 22px;
          --radius-md: 14px;
          --radius-sm: 10px;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
        }

        body {
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          color: var(--text);
          background:
            radial-gradient(1000px 600px at 8% 5%, rgba(56, 189, 248, 0.24), transparent 60%),
            radial-gradient(900px 500px at 90% 15%, rgba(45, 212, 191, 0.2), transparent 62%),
            linear-gradient(165deg, var(--bg-0), var(--bg-1));
          padding: 28px;
        }

        .shell {
          max-width: 1080px;
          margin: 0 auto;
          background: var(--panel);
          backdrop-filter: blur(12px);
          border: 1px solid var(--panel-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
          overflow: hidden;
          animation: rise 500ms ease-out both;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(129, 153, 188, 0.2);
          background: rgba(10, 18, 37, 0.66);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .pulse {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--ok);
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.65);
          animation: pulse 2s infinite;
        }

        .status {
          font-family: "IBM Plex Mono", Consolas, monospace;
          font-size: 12px;
          color: #c9def8;
        }

        .content {
          padding: 34px 24px 28px;
          display: grid;
          gap: 22px;
        }

        .hero {
          display: grid;
          gap: 10px;
        }

        .eyebrow {
          font-family: "IBM Plex Mono", Consolas, monospace;
          color: var(--accent);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: clamp(2rem, 3.8vw, 3.1rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
        }

        .subtitle {
          margin: 0;
          max-width: 760px;
          color: var(--muted);
          font-size: 1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 18px;
        }

        .panel {
          background: linear-gradient(180deg, rgba(18, 30, 57, 0.75), rgba(11, 20, 40, 0.75));
          border: 1px solid rgba(129, 153, 188, 0.2);
          border-radius: var(--radius-md);
          padding: 18px;
        }

        .panel h2 {
          margin: 0 0 14px;
          font-size: 1rem;
          color: #d8ebff;
        }

        .route-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .route-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          background: rgba(5, 12, 26, 0.55);
          border: 1px solid rgba(99, 143, 189, 0.22);
        }

        .badge {
          font-family: "IBM Plex Mono", Consolas, monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 4px 8px;
          border-radius: 999px;
          min-width: 56px;
          text-align: center;
        }

        .get {
          color: #9af0ff;
          background: rgba(14, 165, 233, 0.18);
          border: 1px solid rgba(56, 189, 248, 0.45);
        }

        .post {
          color: #bef3d7;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .ws {
          color: #fde8b2;
          background: rgba(251, 191, 36, 0.18);
          border: 1px solid rgba(251, 191, 36, 0.35);
        }

        .route-path {
          font-family: "IBM Plex Mono", Consolas, monospace;
          font-size: 13px;
          color: #d7e9ff;
          word-break: break-all;
        }

        .quick-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .btn {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          text-decoration: none;
          font-size: 13px;
          color: #d8f4ff;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.35), rgba(6, 182, 212, 0.2));
          border: 1px solid rgba(56, 189, 248, 0.35);
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .btn:hover {
          transform: translateY(-1px);
          border-color: rgba(125, 220, 255, 0.65);
        }

        .code {
          margin: 0;
          padding: 12px;
          border-radius: var(--radius-sm);
          background: #020712;
          border: 1px solid rgba(77, 120, 168, 0.28);
          color: #b6daf8;
          font-family: "IBM Plex Mono", Consolas, monospace;
          font-size: 12px;
          overflow-x: auto;
          line-height: 1.6;
        }

        .stack {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .chip {
          font-family: "IBM Plex Mono", Consolas, monospace;
          font-size: 11px;
          color: #cce7ff;
          border: 1px solid rgba(117, 167, 220, 0.36);
          background: rgba(8, 16, 32, 0.65);
          border-radius: 999px;
          padding: 6px 10px;
        }

        .footer {
          margin-top: 6px;
          color: #7894b5;
          font-size: 12px;
          text-align: center;
          font-family: "IBM Plex Mono", Consolas, monospace;
        }

        @media (max-width: 900px) {
          body {
            padding: 16px;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .quick-links {
            grid-template-columns: 1fr;
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.65);
          }

          70% {
            box-shadow: 0 0 0 9px rgba(34, 197, 94, 0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    </head>
    <body>
      <div class="shell">
        <div class="topbar">
          <div class="brand">
            <span class="pulse"></span>
            <span>Zyrentis Interview API</span>
          </div>
          <div class="status">STATUS: ONLINE</div>
        </div>

        <main class="content">
          <section class="hero">
            <div class="eyebrow">Real-Time Interview Infrastructure</div>
            <h1>Dark mode control center for coding interviews.</h1>
            <p class="subtitle">
              Built for session orchestration, candidate token exchange, and live collaborative coding over WebSocket.
            </p>
          </section>

          <section class="grid">
            <article class="panel">
              <h2>Routes</h2>
              <ul class="route-list">
                <li class="route-item">
                  <span class="badge get">GET</span>
                  <span class="route-path">/</span>
                </li>
                <li class="route-item">
                  <span class="badge get">GET</span>
                  <span class="route-path">/healthz</span>
                </li>
                <li class="route-item">
                  <span class="badge post">POST</span>
                  <span class="route-path">/api/auth/login</span>
                </li>
                <li class="route-item">
                  <span class="badge post">POST</span>
                  <span class="route-path">/api/auth/exchange-invite</span>
                </li>
                <li class="route-item">
                  <span class="badge post">POST</span>
                  <span class="route-path">/api/interviews</span>
                </li>
                <li class="route-item">
                  <span class="badge get">GET</span>
                  <span class="route-path">/api/interviews</span>
                </li>
                <li class="route-item">
                  <span class="badge post">POST</span>
                  <span class="route-path">/api/sessions</span>
                </li>
                <li class="route-item">
                  <span class="badge ws">WS</span>
                  <span class="route-path">/ws?token=&lt;SESSION_JWT&gt;</span>
                </li>
              </ul>
            </article>

            <article class="panel">
              <h2>Quick access</h2>
              <div class="quick-links">
                <a class="btn" href="/healthz">Health JSON</a>
                <a class="btn" href="https://deno.com" target="_blank" rel="noreferrer">Deno Docs</a>
              </div>
              <pre class="code">const ws = new WebSocket("ws://localhost:8000/ws?token=SESSION_JWT");
ws.onmessage = (event) =&gt; console.log(event.data);</pre>
              <div class="stack">
                <span class="chip">Deno</span>
                <span class="chip">Hono</span>
                <span class="chip">Neon Postgres</span>
                <span class="chip">Upstash Redis</span>
                <span class="chip">JWT Sessions</span>
              </div>
            </article>
          </section>

          <div class="footer">Zyrentis | API gateway for technical interviews</div>
        </main>
      </div>
    </body>
  </html>
`;

healthRoutes.get("/", (c) => {
  return c.html(indexHtml);
});

healthRoutes.get("/healthz", (c) => {
  return c.json({
    ok: true,
    service: "zyrentis-api",
    ts: new Date().toISOString(),
  });
});
