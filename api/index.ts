import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { readConfig, updateConfig } from "../utils";
import { ConfigMessage } from "types";
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
    const { twitchUser, youtubeVideoId, youtubeApiKey, kickUser } = request.body;
    updateConfig({ twitchUser, youtubeVideoId, youtubeApiKey, kickUser });
  }
);

api.get(
  "/api/get-config",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const config = readConfig();
    reply.send(config);
  }
);

export default api;
