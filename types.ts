import { Badges } from "tmi.js";

export type ConfigMessage = {
  twitchUser: string;
  youtubeVideoId: string;
  youtubeApiKey: string;
  kickUser: string;
  kickUserChatroom: string;
};

export type ChatMessage = {
  id: string;
  name: string;
  provider: string;
  isSub: boolean | undefined;
  isMod: boolean | undefined;
  isOwner: boolean | undefined;
  badgesRaw: string[];
  badges: never[] | Badges | { type: string; text: string }[];
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
  event: string;
  data: {
    id: string;
    chatroom_id: number;
    content: string;
    type: string;
    created_at: string;
    sender: {
      id: number;
      username: string;
      slug: string;
      identity: {
        color: string;
        badges: { type: string; text: string }[];
      };
    };
    metadata?: {
      original_sender: { id: string; username: string };
      original_message: {
        id: string;
        content: string;
      };
    };
  };
  channel: string;
};

export type KickChatRoom = {
  id: number;
  chatable_type: string;
  channel_id: number;
  created_at: string;
  updated_at: string;
  chat_mode_old: string;
  chat_mode: string;
  slow_mode: boolean;
  chatable_id: number;
  followers_mode: boolean;
  subscribers_mode: boolean;
  emotes_mode: boolean;
  message_interval: number;
  following_min_duration: number;
};
