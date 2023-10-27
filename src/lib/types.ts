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
  isSub: boolean;
  isMod: boolean;
  isOwner: boolean;
  badgesRaw: string[];
  badges: never[] | Badges;
  emotesRaw: string[];
  emotes: never[] | { [emoteid: string]: string[] };
  message: string;
  channelName: string;
};

export type MessageTypes = {
  name: string;
  provider: string;
  isSub: boolean;
  isMod: boolean;
  badgesRaw: string[];
  badges: never[] | Badges;
  emotesRaw: string[];
  emotes: never[] | { [emoteid: string]: string[] };
  message: string;
  channelName: string;
  betterEmotes: BetterEmote[];
  frankerFaceZEmotes: any[];
  className?: string;
};
