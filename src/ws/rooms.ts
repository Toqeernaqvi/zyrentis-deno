export type RoomState = {
  clients: Set<WebSocket>;
  docByFile: Record<string, string>;
  version: number;
};

const rooms = new Map<string, RoomState>();

export function getRoom(sessionId: string): RoomState {
  let room = rooms.get(sessionId);
  if (!room) {
    room = { clients: new Set(), docByFile: {}, version: 0 };
    rooms.set(sessionId, room);
  }
  return room;
}

export function removeClient(sessionId: string, socket: WebSocket) {
  const room = rooms.get(sessionId);
  if (!room) return;
  room.clients.delete(socket);
  if (room.clients.size === 0) rooms.delete(sessionId);
}

export function broadcast(sessionId: string, data: unknown) {
  const room = rooms.get(sessionId);
  if (!room) return;
  const payload = JSON.stringify(data);

  for (const client of room.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  }
}
