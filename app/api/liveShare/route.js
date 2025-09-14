import { WebSocketServer } from "ws";

let wss = null;
let rooms = {};

export const GET = (req) => {
  if (!wss) {
    console.log("Initializing WebSocket server...");

    wss = new WebSocketServer({ port: 8000 });

    wss.on("connection", (ws) => {
      console.log("Client connected ✅", ws);

      ws.on("message", (message) => {
        data = JSON.parse(message);
      });
    });
  }
  return Response.json({
    message: "WebSocket server initialized",
  });
};
