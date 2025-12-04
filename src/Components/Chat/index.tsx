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
    <div className="px-20">
      <h2>
        {connected
          ? "✅ Web Socket is Connected"
          : "❌Web Socket is Connecting..."}
      </h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!connected}
        className="mt-3 h-10 rounded-lg focus:outline-none shadow-lg px-3"
      />

      <button
        className="ml-3 shadow-lg bg-green-600 text-white cursor-pointer px-5 py-2 rounded-lg "
        disabled={!connected}
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default ChatComponent;
