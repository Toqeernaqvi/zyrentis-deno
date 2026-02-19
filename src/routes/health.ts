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
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 800px;
        padding: 40px;
      }
      h1 {
        color: #667eea;
        margin-bottom: 10px;
        font-size: 2.5em;
      }
      .subtitle {
        color: #666;
        margin-bottom: 30px;
        font-size: 1.1em;
      }
      .status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 30px;
        padding: 15px;
        background: #f0f9ff;
        border-left: 4px solid #667eea;
        border-radius: 4px;
      }
      .status-indicator {
        width: 12px;
        height: 12px;
        background: #10b981;
        border-radius: 50%;
      }
      .status-text {
        color: #10b981;
        font-weight: 600;
      }
      .section {
        margin-bottom: 30px;
      }
      .section h2 {
        color: #333;
        font-size: 1.3em;
        margin-bottom: 15px;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
      }
      .link-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }
      a, button {
        padding: 12px 16px;
        background: #667eea;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.95em;
        transition: all 0.3s ease;
        display: inline-block;
        text-align: center;
      }
      a:hover, button:hover {
        background: #764ba2;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
      }
      .code-block {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 6px;
        font-family: "Monaco", "Courier New", monospace;
        font-size: 0.9em;
        color: #333;
        overflow-x: auto;
        margin-top: 10px;
      }
      .feature-list {
        list-style: none;
      }
      .feature-list li {
        padding: 8px 0;
        color: #555;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .feature-list li:before {
        content: "✓";
        color: #10b981;
        font-weight: bold;
        font-size: 1.2em;
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        text-align: center;
        color: #999;
        font-size: 0.9em;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Zyrentis API</h1>
        <p class="subtitle">Real-time collaborative code interview platform</p>

        <div class="status">
          <div class="status-indicator"></div>
          <div class="status-text">System Online</div>
        </div>

        <div class="section">
          <h2>🔗 API Endpoints</h2>
          <div class="link-group">
            <a href="/healthz">Health Check</a>
            <a href="/api/auth">Auth Routes</a>
            <a href="/api/interviews">Interviews</a>
            <a href="/api/sessions">Sessions</a>
          </div>
        </div>

        <div class="section">
          <h2>✨ Features</h2>
          <ul class="feature-list">
            <li>Real-time WebSocket-powered code editor</li>
            <li>multi-user interview sessions</li>
            <li>Persistent document state (Redis)</li>
            <li>Rate limiting on public endpoints</li>
            <li>JWT-based authentication</li>
            <li>Deploy-ready on Deno Deploy</li>
          </ul>
        </div>

        <div class="section">
          <h2>📡 WebSocket Connection</h2>
          <p>
            Connect to: <code>ws://localhost:8000/ws?token=YOUR_JWT_TOKEN</code>
          </p>
          <div class="code-block">
            const ws = new WebSocket("ws://localhost:8000/ws?token=TOKEN");
          </div>
        </div>

        <div class="section">
          <h2>📚 Documentation</h2>
          <p>
            API is built with <strong>Hono</strong> on <strong>Deno
              Deploy</strong>, featuring:
            </p>
            <ul class="feature-list">
              <li>Async/await-native code</li>
              <li>Type-safe request/response handling</li>
              <li>Middleware-based architecture</li>
              <li>Edge computing ready</li>
            </ul>
          </div>

          <div class="footer">
            <p>Built with ❤️ | Deno + Hono + Neon + Upstash</p>
          </div>
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
