"use client";

import { useState, useEffect } from "react";

export default function LiveShare({ folioId }) {
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState("");
  const [ws, setWs] = useState(null);
  const [file, setFile] = useState(null);
  const [currentState, setCurrentState] = useState(null);

  const initializeSocket = () => {
    const socket = new WebSocket(`ws://${window.location.host}`);

    fetch("/api/liveShare").catch(console.error);

    socket.onopen = () => {
      console.log("Connected!");
      socket.send(JSON.stringify({ type: "JOIN", folioId }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("Message from server ", msg);

      switch (msg.type) {
        case "JOINED":
          setCurrentState(msg.data.state || "idle");
          break;

        case "READY_TO_RECEIVE":
          setCurrentState("ready_to_receive");
          break;

        default:
          console.log("Unhandled:", msg);
      }
    };

    setWs(socket);

    return socket;
  };

  useEffect(() => {
    const socket = initializeSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket");
        socket.close();
      } else {
        console.log("Socket not open yet, skipping close");
      }
    };
  }, [folioId]);

  const sendFile = () => {
    if (!ws | (ws.readyState !== WebSocket.OPEN)) {
      alert("Websocket not connected yet");
      return;
    }

    if (!file) {
      alert("Please select a file first");
      return;
    }
    const data = {
      type: "SEND",
      folioId,
      data: {
        fileName: file.name,
        fileSize: file.size,
        folioId,
      },
    };

    console.log("Sending:", JSON.stringify(data));
    ws.send(JSON.stringify(data));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple WebSocket</h1>

      <p>Current State: {currentState}</p>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        placeholder="Select file"
        className="border my-2 p-2"
      />

      <button onClick={sendFile}>Send</button>

      <p>
        <strong>Received:</strong> {received}
      </p>
    </div>
  );
}
