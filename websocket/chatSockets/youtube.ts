import { WebSocket } from "ws";
import axios from "axios";
import { readConfig } from "../../utils";
import { ChatMessage, YoutubeResponse } from "types";

let nextPageToken: string | undefined;

export const youtube = async (ws: WebSocket) => {
  const configData = readConfig();
  const apiKey = configData.youtubeApiKey;
  const videoId = configData.youtubeVideoId;
  if (!apiKey || !videoId) return;
  async function getLiveChatId(apiKey: string, videoId: string) {
    if (videoId.includes("youtube.com")) {
      videoId = videoId.split("v=")[1];
    }
    let response;
    try {
      response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=liveStreamingDetails&key=${apiKey}`
      );
    } catch (error) {
      throw new Error("Error getting live chat ID");
    }
    if (!response) {
      throw new Error("No response from YouTube API");
    }
    const data = response.data;
    return data.items[0].liveStreamingDetails.activeLiveChatId;
  }
  let response;
  try {
    let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${await getLiveChatId(
      apiKey,
      videoId
    )}&part=snippet,authorDetails&key=${apiKey}`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }
    response = await axios.get(url);
    nextPageToken = response.data.nextPageToken;
  } catch (error) {
    throw new Error("Error getting live chat messages");
  }
  if (!response) {
    throw new Error("No response from YouTube API");
  }
  const data: YoutubeResponse[] = await response.data.items;
  const chatMessages: ChatMessage[] = [];
  for (let i = 0; i < data.length; i++) {
    const message = data[i];
    const decoder = new TextDecoder();
    const newChatMessage: ChatMessage = {
      id: message.id,
      name: decoder.decode(
        new Uint8Array(
          message.authorDetails.displayName
            .split("")
            .map((c) => c.charCodeAt(0))
        )
      ),
      provider: "youtube",
      isSub: message.authorDetails.isChatSponsor,
      isMod: message.authorDetails.isChatModerator,
      isOwner: message.authorDetails.isChatOwner,
      badgesRaw: [],
      badges: [],
      emotesRaw: [],
      emotes: [],
      message: message.snippet.textMessageDetails.messageText,
      channelName: "",
    };
    chatMessages.push(newChatMessage);
  }
  if (!chatMessages) return;
  // TODO: handle message when it has emojis/special characters
  if (ws.readyState === WebSocket.OPEN) {
    chatMessages.map((chatMessage) => {
      ws.send(JSON.stringify(chatMessage));
    });
  } else {
    const websocketStates = {
      0: "CONNECTING",
      1: "OPEN",
      2: "CLOSING",
      3: "CLOSED",
    };
    throw new Error(
      "[Youtube]: WebSocket connection is not open. Current state:" +
        websocketStates[ws.readyState]
    );
  }
};
