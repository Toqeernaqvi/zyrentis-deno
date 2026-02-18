import { verifyJwt } from "../lib/jwt_verify.ts";
import { broadcast, getRoom, removeClient } from "./rooms.ts";

type IncomingMessage =
  | { type: "code_sync"; payload: { file: string; content: string } }
  | { type: string; payload?: unknown };

export async function handleWs(req: Request): Promise<Response> {
  // Require WS upgrade (standard pattern in Deno docs)
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 426 }); // Upgrade Required
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return new Response("Missing token", { status: 401 });

  const payload = await verifyJwt(token);
  if (!payload) return new Response("Invalid token", { status: 401 });

  const sessionId = String(payload.session_id ?? "");
  const role = String(payload.role ?? "candidate"); // MVP default

  if (!sessionId) return new Response("Missing session_id", { status: 403 });

  const { socket, response } = Deno.upgradeWebSocket(req); // upgrade request

  const room = getRoom(sessionId);
  room.clients.add(socket);

  socket.onopen = () => {
    // Send initial snapshot so frontend can hydrate editor
    socket.send(JSON.stringify({
      type: "state_snapshot",
      session_id: sessionId,
      payload: { docByFile: room.docByFile, version: room.version },
    }));
  };

  socket.onmessage = (ev) => {
    let msg: IncomingMessage | null = null;
    try {
      msg = JSON.parse(String(ev.data));
    } catch {
      return;
    }

    if (!msg) return;

    // MVP rule: only candidate can send code_sync
    if (msg.type === "code_sync") {
      if (role !== "candidate") return;

      const file = String((msg.payload as { file?: string })?.file ?? "main.py");
      const content = String((msg.payload as { content?: string })?.content ?? "");

      room.docByFile[file] = content;
      room.version += 1;

      broadcast(sessionId, {
        type: "code_sync",
        session_id: sessionId,
        payload: { file, content, version: room.version },
      });
    }
  };

  socket.onclose = () => removeClient(sessionId, socket);
  socket.onerror = () => removeClient(sessionId, socket);

  return response;
}
