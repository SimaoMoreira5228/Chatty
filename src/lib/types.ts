import { Badges } from "tmi.js";

export type FFEmotes = {
  artist: string | null;
  created_at: string;
  css: string | null;
  height: number;
  hidden: boolean;
  id: number;
  last_updated: string;
  margins: string | null;
  modifier: boolean;
  modifier_flags: number | string;
  name: string;
  offset: number | null;
  owner: {
    display_name: string;
    name: string;
    _id: number;
  };
  public: boolean;
  status: number | string;
  urls: { [id: number]: string };
  usage_count: number;
  width: number;
};

export type SevenEmote = {
  id: string;
  name: string;
  owner: {
    id: string;
    twitch_id: string;
    login: string;
    display_name: string;
    role: {
      id: string;
      name: string;
      position: number;
      color: number;
      allowed: number;
      denied: number;
    };
    profile_picture_id: string;
  };
  visibility: number;
  visibility_simple: any[];
  mime: string;
  status: number;
  tags: string[];
  width: number[];
  height: number[];
  urls: [string, string][];
};

export type BetterEmote = {
  animated: boolean;
  code: string;
  id: string;
  imageType: string;
  modifier: boolean;
  userId: string;
};

export type WebsocketMessageData = {
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
  message: string;
  channelName: string;
};

export type MessageTypes = {
  name: string;
  provider: string;
  isSub: boolean | undefined;
  isMod: boolean | undefined;
  isOwner: boolean | undefined;
  badgesRaw: string[];
  badges: never[] | Badges | { type: string; text: string }[];
  emotesRaw: string[];
  emotes: never[] | { [emoteid: string]: string[] };
  message: string;
  channelName: string;
  betterEmotes: BetterEmote[];
  frankerFaceZEmotes: FFEmotes[];
  sevenTVEmotes: SevenEmote[];
  className?: string;
};

export type VersionData = {
  version: string;
  latestVersion: string;
  isOutdated: boolean;
  lastestVersionURL: string;
};
