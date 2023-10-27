import { Badges } from "tmi.js";

export type ConfigMessage = {
  twitchUser: string;
  youtubeVideoId: string;
  youtubeApiKey: string;
  kickUser: string;
};

export type ChatMessage = {
  id: string;
  name: string;
  provider: string;
  isSub: boolean;
  isMod: boolean;
  isOwner: boolean;
  badgesRaw: string[];
  badges: never[] | Badges;
  emotesRaw: string[];
  emotes: never[] | { [emoteid: string]: string[] };
  message: any;
  channelName: string;
};

export type Message = {
  type: string;
  configData?: ConfigMessage;
  messageData?: ChatMessage;
};

export type YoutubeResponse = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    type: string;
    liveChatId: string;
    authorChannelId: string;
    publishedAt: string;
    hasDisplayContent: boolean;
    displayMessage: string;
    textMessageDetails: {
      messageText: string;
    };
  };
  authorDetails: {
    channelId: string;
    channelUrl: string;
    displayName: string;
    profileImageUrl: string;
    isVerified: boolean;
    isChatOwner: boolean;
    isChatSponsor: boolean;
    isChatModerator: boolean;
  };
};

export type KickMessage = {
  id: string;
  chatroom_id: number;
  content: string;
  type: string;
  created_at: string;
  sender: {
    id: number;
    username: string;
    slug: string;
    identity: { color: string; badges: any };
  };
  metadata?: {
    original_sender: { id: string; username: string };
    original_message: {
      id: string;
      content: string;
    };
  };
};
