"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    fetch("/api/socket").then(() => {});

    const websocket = new WebSocket("ws://localhost:8000");

    websocket.onopen = () => {
      console.log("Connected!");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      console.log("Received:", event);
      setReceived(event.data);
    };

    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (ws && message) {
      ws.send(message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple WebSocket</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        className="border my-2 p-2"
      />

      <button onClick={sendMessage}>Send</button>

      <p>
        <strong>Received:</strong> {received}
      </p>
    </div>
  );
}
