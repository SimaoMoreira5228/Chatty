import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { readConfig, updateConfig } from "../utils";
import { ConfigMessage, KickChatRoom } from "types";
import { BrowserWindow } from "electron";
const api = Fastify();

api.register(cors, {
  origin: "*",
  methods: ["GET", "POST"],
});

api.post(
  "/api/update-config",
  async (
    request: FastifyRequest<{ Body: ConfigMessage }>,
    reply: FastifyReply
  ) => {
    const {
      twitchUser,
      youtubeVideoId,
      youtubeApiKey,
      kickUser,
      kickUserChatroom,
    } = request.body;
    try {
      updateConfig({
        twitchUser,
        youtubeVideoId,
        youtubeApiKey,
        kickUser,
        kickUserChatroom,
      });
      reply.status(200).send({ success: true });
    } catch (error) {
      reply
        .status(500)
        .send({
          error: `An unexpected error occurred while updating the config: ${error}`,
        });
    }
  }
);

api.post(
  "/api/get-kick-user-chatroom",
  async (
    request: FastifyRequest<{ Body: { kickUser: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const win = new BrowserWindow({
        width: 200,
        height: 50,
        webPreferences: {
          nodeIntegration: true,
        },
      });

      win.webContents.openDevTools();

      const newkickUser = request.body.kickUser;

      win.loadURL(
        `https://kick.com/api/v2/channels/${newkickUser
          .toString()
          .toLowerCase()}`
      );

      const result = await win.webContents.executeJavaScript(
        "document.body.innerHTML"
      );

      const parsedResult = JSON.parse(result);

      let chatroom: KickChatRoom;

      if (parsedResult.chatroom !== undefined) {
        chatroom = parsedResult.chatroom;

        setTimeout(() => {
          win.close();
        }, 2000); // 2 seconds

        reply.status(200).send({ kickUserChatroom: chatroom.id.toFixed() });
      } else {
        win.close();
        reply.status(500).send({
          error: `Chatroom not found   ${JSON.stringify(
            parsedResult.chatroom
          )}`,
        });
      }
    } catch (error) {
      console.error(error);
      reply
        .status(500)
        .send({ error: `An unexpected error occurred ${error}` });
    }
  }
);

api.get(
  "/api/get-config",
  async (_request: FastifyRequest, reply: FastifyReply) => {
    const config = readConfig();
    reply.send(config);
  }
);

export default api;
