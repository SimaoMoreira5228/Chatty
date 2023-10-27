import { type ChatMessage } from "../../types";
import tmi from "tmi.js";
import { configFileUrl, readConfig } from "../../utils";
import { WebSocket } from "ws";
import fs from "fs";

export const twitchSocket = async (ws: WebSocket) => {
  const config = readConfig();
  const channels = config.twitchUser.split(",").map((user: string) => user.trim());
  if (config.twitchUser) return;
  let twitchClient: tmi.Client;

  const startTwitchSocket = async (ws: WebSocket, channels: string[]) => {
    twitchClient = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true,
      },
      channels,
    });
    twitchClient.connect();
    twitchClient.on("message", (channel, tags, message, self) => {
      const newChatMessage: ChatMessage = {
        id: tags["id"] ?? "",
        name: tags["display-name"] ?? "",
        provider: "twitch",
        isSub: tags["subscriber"] ?? false,
        isMod: tags["mod"] ?? false,
        isOwner: tags["badges-raw"]?.includes("broadcaster") ?? false,
        badgesRaw: tags["badges-raw"]?.split(",") ?? [],
        badges: tags["badges"] ?? [],
        emotesRaw: tags["emotes-raw"]?.split(",") ?? [],
        emotes: tags["emotes"] ?? [],
        message: message,
        channelName: channel,
      };
      if (!newChatMessage) return;
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(newChatMessage));
      } else {
        console.error(
          "WebSocket connection is not open. Current state:",
          ws.readyState
        );
      }
    });
  };

  startTwitchSocket(ws, channels);

  fs.watchFile(configFileUrl, (curr, prev) => {
    const newConfig = readConfig();
    const newChannels = newConfig.twitchUser
      .split(",")
      .map((user: string) => user.trim());
    twitchClient.disconnect();
    startTwitchSocket(ws, newChannels);
  });
};

