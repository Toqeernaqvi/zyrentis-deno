const token = Deno.args[0];
if (!token) {
  console.error("Usage: deno run --allow-net scripts/ws_test.ts TOKEN");
  Deno.exit(1);
}

const port = Deno.env.get("PORT") ?? "8000";
const url = `ws://localhost:${port}/ws?token=${token}`;

console.log("Connecting to:", url);
const ws = new WebSocket(url);

ws.onopen = () => {
  console.log("WS open");
  ws.send(
    JSON.stringify({
      type: "code_sync",
      payload: { file: "main.py", content: "// persisted from ws_test" },
    }),
  );
};

ws.onmessage = (e) => console.log("MSG:", e.data);
ws.onerror = (e) => console.error("WS error", e);
ws.onclose = () => console.log("WS closed");

setTimeout(() => ws.close(), 3000);
