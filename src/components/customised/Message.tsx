import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  type BetterEmote,
  type MessageTypes,
  type FFEmotes,
} from "@/lib/types";
import kick from "@/svgs/Kick.svg";
import twitch from "@/svgs/Twitch.svg";
import youtube from "@/svgs/Youtube.svg";
import HTMLReactParser from "html-react-parser";
import DOMPurify from "dompurify";
import axios from "axios";

export const Message = ({
  name,
  provider,
  isSub,
  isMod,
  isOwner,
  emotes,
  message,
  channelName,
  betterEmotes,
  frankerFaceZEmotes,
  sevenTVEmotes,
  className,
}: MessageTypes) => {
  betterEmotes.forEach((emote) => {
    const emoteRegex = new RegExp(emote.code, "g");
    const url = `https://cdn.betterttv.net/emote/${emote.id}/3x.webp`;
    message = message.replace(
      emoteRegex,
      `<img src="${url}" alt="${emote.code}" class="h-8 w-8" />`
    );
  });

  frankerFaceZEmotes.forEach((emote) => {
    const emoteRegex = new RegExp(emote.name, "g");
    const url = `https:${emote.urls[4]}`;
    message = message.replace(
      emoteRegex,
      `<img src="${url}" alt="${emote.name}" class="h-8 w-8" />`
    );
  });

  sevenTVEmotes.forEach((emote) => {
    const emoteRegex = new RegExp(emote.name, "g");
    const url = `https://cdn.7tv.app/emote/${emote.id}/4x.webp`;
    message = message.replace(
      emoteRegex,
      `<img src="${url}" alt="${emote.name}" class="h-8 w-8" />`
    );
  });

  const sanitizedHTML = DOMPurify.sanitize(message);
  const parsedHTML = HTMLReactParser(sanitizedHTML);

  return (
    <Alert className={className}>
      <div className="flex flex-row">
        <Avatar>
          {provider === "twitch" && <AvatarImage src={twitch} />}
          {provider === "youtube" && <AvatarImage src={youtube} />}
          {provider === "kick" && <AvatarImage src={kick} />}
        </Avatar>
        <div className="ml-2">
          <div className="flex flex-row items-center overflow-hidden">
            <AlertTitle>{name}</AlertTitle>
            {isSub && (
              <Badge variant={"destructive"} className="ml-2 h-4">
                Subscriber
              </Badge>
            )}
            {isMod && <Badge className="ml-2 h-4">Moderator</Badge>}
            {isOwner && (
              <Badge variant={"secondary"} className="ml-2 h-4">
                Owner
              </Badge>
            )}
          </div>
          <AlertDescription className="flex flex-row">
            {parsedHTML}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
