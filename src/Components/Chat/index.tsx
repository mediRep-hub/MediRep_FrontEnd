import { useState, useEffect } from "react";
import { ws, sendMessage } from "../../WebSocket";

const ChatComponent = () => {
  const [connected, setConnected] = useState(ws.readyState === WebSocket.OPEN);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleOpen = () => setConnected(true);
    const handleClose = () => setConnected(false);

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("close", handleClose);
    };
  }, []);

  const handleSend = () => {
    if (!connected) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div>
      <h2>{connected ? "✅ Connected" : "❌ Connecting..."}</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!connected}
      />

      <button disabled={!connected} onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default ChatComponent;
