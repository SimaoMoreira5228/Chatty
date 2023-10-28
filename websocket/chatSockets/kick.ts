import { WebSocket } from "ws";
import { readConfig, configFileUrl } from "../../utils";
import fs from "fs";
import { ChatMessage, KickMessage } from "types";

export const kick = async (ws: WebSocket) => {
  let kickSocket: WebSocket;

  function startKickSocket() {
    kickSocket = new WebSocket(
      "wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false"
    );

    kickSocket.on("open", async () => {
      const { kickUserChatroom } = readConfig();
      const subscriptionData = {
        event: "pusher:subscribe",
        data: {
          auth: "",
          channel: `chatrooms.${kickUserChatroom}.v2`,
        },
      };
      kickSocket.send(JSON.stringify(subscriptionData, null, 2));
    });

    kickSocket.on("message", (data: any) => {
      try {
        const obj = JSON.parse(data);
        const parsedEvent: KickMessage["event"] = obj.event;
        const parsedData: KickMessage["data"] = JSON.parse(obj.data);
        const parsedChannel: KickMessage["channel"] = obj.channel;
        if (parsedEvent === "App\\Events\\ChatMessageEvent") {
          const messsage: ChatMessage = {
            badges: parsedData.sender.identity.badges ?? [],
            badgesRaw: [],
            channelName: parsedChannel,
            emotes: [],
            emotesRaw: [],
            id: parsedData.id,
            isMod: parsedData.sender.identity.badges
              ?.map((badge) => badge.type)
              .includes("moderator"),
            isOwner:
              parsedData.sender.identity.badges
                ?.map((badge) => badge.type)
                .includes("owner") ||
              parsedData.sender.identity.badges
                ?.map((badge) => badge.type)
                .includes("broadcaster"),
            message: parsedData.content,
            name: parsedData.sender.username || parsedData.sender.slug || "",
            provider: "kick",
            isSub: parsedData.sender.identity.badges
              ?.map((badge) => badge.type)
              .includes("subscriber"),
          };
          if (!messsage.message) return;
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(messsage));
          } else {
            const websocketStates = {
              0: "CONNECTING",
              1: "OPEN",
              2: "CLOSING",
              3: "CLOSED",
            };
            throw new Error(
              "[Kick]: WebSocket connection is not open. Current state:" +
                websocketStates[ws.readyState]
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  startKickSocket();

  fs.watchFile(configFileUrl, (_curr, _prev) => {
    kickSocket.close();
    startKickSocket();
  });
};
