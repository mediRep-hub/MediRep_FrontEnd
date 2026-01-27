import { BASE_URL } from "../api/endpoints";

export const ws = new WebSocket(BASE_URL);

const messageQueue: string[] = [];

// Called when connection opens
ws.onopen = () => {
  console.log("✅ WebSocket connected");

  // Flush queued messages
  while (messageQueue.length > 0) {
    ws.send(messageQueue.shift()!);
  }
};

// Send message utility
export const sendMessage = (msg: string) => {
  const data = JSON.stringify({ type: "chat", payload: msg });
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(data);
  } else {
    messageQueue.push(data);
  }
};
