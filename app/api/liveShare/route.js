import { WebSocketServer } from "ws";

let wss = null;
let rooms = {};

export const GET = (req) => {
  if (!wss) {
    console.log("Initializing WebSocket server...");

    wss = new WebSocketServer({ noServer: true });

    wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", (message) => {
        // console.log("Receivedddddd string:", message);
        const data = JSON.parse(message);
        console.log("Received:", data);
        if (!data.type) return;

        switch (data.type) {
          case "JOIN":
            let currentRoom = rooms[data.folioId] || null;
            ws.folioId = data.folioId;
            if (!currentRoom) {
              rooms[data.folioId] = {
                state: "idle",
                sender: null,
                filename: null,
                filesize: 0,
              };
              currentRoom = rooms[data.folioId];
            }
            ws.send(JSON.stringify({ type: "JOINED", data: currentRoom }));
            break;

          case "SEND":
            if (!data.data) return;

            rooms[data.folioId] = {
              state: "ready_to_receive",
              sender: ws || null,
              fileName: data.fileName || "",
              fileSize: data.fileSize || 0,
            };
            const object_to_send = {
              type: "READY_TO_RECEIVE",
              data: rooms[data.folioId],
            };
            console.log("Sending:", JSON.stringify(object_to_send));
            wss.clients.forEach((client) => {
              if (
                client.readyState === client.OPEN &&
                client.folioId === data.folioId
              ) {
                client.send(JSON.stringify(object_to_send));
              }
            });
            break;

          case "RECEIVE":
            ws.folioId = data.folioId;
        }
      });
    });
  }
  return Response.json({
    message: "WebSocket server initialized",
  });
};
