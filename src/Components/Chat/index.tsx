import { useState, useEffect } from "react";
import { ws, sendMessage } from "../../WebSocket";

const ChatComponent = () => {
  const [connected, setConnected] = useState(ws.readyState === WebSocket.OPEN);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleOpen = () => setConnected(true);
    const handleClose = () => setConnected(false);

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);

    if (ws.readyState === WebSocket.OPEN) {
      handleOpen();
    }
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data.payload]);
      }
    };
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("close", handleClose);
      ws.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleSend = () => {
    if (!connected || !input) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="px-5 md:px-20 py-5">
      <h2 className="text-lg font-semibold mb-3">
        {connected ? "✅ WebSocket Connected" : "❌ Connecting..."}
      </h2>

      <div className="flex items-center mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!connected}
          className="flex-1 h-10 rounded-lg px-3 py-2 shadow-md focus:outline-none disabled:cursor-not-allowed"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          disabled={!connected || !input}
          className="ml-3 px-5 py-2 rounded-lg bg-green-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>

      <div className="border rounded-md p-3 h-60 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-400">No messages yet</p>
        )}
        {messages.map((msg, idx) => (
          <p key={idx} className="mb-1">
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;
