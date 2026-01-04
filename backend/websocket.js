
import WebSocket, { WebSocketServer } from 'ws';


export const clients = new Map(); 

export function initWebSocket() {
 const wss = new WebSocketServer({ port: 8081 });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.type === 'register') {
        ws.userId = data.userId;
        clients.set(data.userId, ws);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
      }
    });
  });
}

export function sendNotification(userId, payload) {
  const ws = clients.get(userId);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}
