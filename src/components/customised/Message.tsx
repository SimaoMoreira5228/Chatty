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
  badges,
  badgesRaw,
  emotes,
  emotesRaw,
  message,
  channelName,
  betterEmotes,
  frankerFaceZEmotes,
  className,
}: MessageTypes) => {
  const words = message.split(" ");
  const newMessage = words.map((word) => {
    const betterEmote = betterEmotes.find(
      (emote: BetterEmote) => emote.code === word
    );
    const ffEmote: FFEmotes = frankerFaceZEmotes.find(
      (emote: FFEmotes) => emote.name === word
    );
    if (betterEmote) {
      // BetterTTV emotes
      return (
        <img
          src={`https://cdn.betterttv.net/emote/${betterEmote.id}/3x.webp`}
          alt={word}
          className="w-6 h-6"
        />
      );
    } else if (ffEmote) {
      // FrankerFaceZ emotes
      return <img src={ffEmote.urls[4]} alt={word} className="w-6 h-6" />;
    } else if (emotesRaw) {
      // twitch emotes
      const stringReplacements: any[] = [];

      Object.entries(emotes).forEach(([id, positions]) => {
        const position = positions[0];
        const [start, end] = position.split("-");
        const stringToReplace = message.substring(
          parseInt(start, 10),
          parseInt(end, 10) + 1
        );

        stringReplacements.push({
          stringToReplace: stringToReplace,
          replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" width="30" height="5">`,
        });
      });

      const messageHTML = stringReplacements.reduce(
        (acc, { stringToReplace, replacement }) => {
          return acc.split(stringToReplace).join(replacement);
        },
        message
      );

      const sanitizedHTML = DOMPurify.sanitize(messageHTML);

      const parsedHTML = HTMLReactParser(sanitizedHTML);

      return parsedHTML;
    }
    return " " + word + " ";
  });

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
            {name === channelName && (
              <Badge variant={"secondary"} className="ml-2 h-4">
                Owner
              </Badge>
            )}
          </div>
          <AlertDescription className="flex flex-row">
            {newMessage}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
