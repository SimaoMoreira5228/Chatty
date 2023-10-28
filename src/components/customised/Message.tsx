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

export const Message = ({
  name,
  provider,
  isSub,
  isMod,
  isOwner,
  emotesRaw,
  message,
  betterEmotes,
  frankerFaceZEmotes,
  className,
}: MessageTypes) => {

  betterEmotes.forEach((emote: BetterEmote) => {
    const emoteRegex = new RegExp(emote.code, "g");
    message = message.replace(emoteRegex, (match) => {
      return `<img src="https://cdn.betterttv.net/emote/${emote.id}/3x.webp" alt="${match}" class="h-6 w-6" />`;
    });
  });

  frankerFaceZEmotes.forEach((emote: FFEmotes) => {
    const emoteRegex = new RegExp(emote.name, "g");
    message = message.replace(emoteRegex, (match) => {
      return `<img src="${emote.urls[4]}" alt="${match}" class="h-6 w-6" />`;
    });
  });

  emotesRaw.forEach((emote: string) => {
    const [id, start, end] = emote.split(":");
    const emoteRegex = new RegExp(message.slice(parseInt(start, 10), parseInt(end, 10) + 1), "g");
    message = message.replace(emoteRegex, (match) => {
      return `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0" alt="${match}" class="h-6 w-6" />`;
    });
  });

  const emoteRegex = /\[emote:(\d+):(\w+)\]/g;
  message = message.replace(emoteRegex, (_match, id, code) => {
    return `<img src="https://files.kick.com/emotes/${id}/fullsize" alt="${code}" class="h-6 w-6" />`;
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
