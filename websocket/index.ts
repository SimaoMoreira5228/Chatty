import { WebSocketServer, WebSocket } from "ws";
import { twitchSocket } from "./chatSockets/twitch";
import { youtube } from "./chatSockets/youtube";
import { kick } from "./chatSockets/kick";
import { messageParser, updateConfig } from "../utils";



const processMessage = async (message: Buffer) => {
  const parsedMessage = messageParser(message);
  console.info("Received message:", parsedMessage);

  switch (parsedMessage.type) {
    case "config":
      if (parsedMessage.configData) {
        updateConfig(parsedMessage.configData);
      } else {
        console.error('configData is missing in message of type "config"');
      }
      break;
    default:
      console.error("Unrecognized message type:", parsedMessage.type);
  }
};

export const startWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    console.info("New WebSocket connection");
    ws.on("message", (message: Buffer) => {
      try {
        processMessage(message);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
    twitchSocket(ws);
    kick(ws);
    setInterval(() => {
      youtube(ws)
    }, 5000); // 5 second
  });

  wss.addListener("error", (error: Error) => {
    console.error("WebSocketServer error:", error);
  });
};
