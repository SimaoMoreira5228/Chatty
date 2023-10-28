import { Settings, Trash } from "lucide-react";
import { Message } from "./components/customised/Message";
import { Button } from "@/components/ui/button";
import { ConfigModal } from "./components/customised/ConfigModal";
import { FFEmotes, type WebsocketMessageData } from "@/lib/types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./svgs/Spinner";

export const App = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isConfigModalOpen, setConfigModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [betterEmotes, setBetterEmotes] = useState([]);
  const [frankerFaceZEmotes, setFrankerFaceZEmotes] = useState<any[]>([]);
  const [defaultValues, setDefaultValues] = useState({
    twitchUser: "",
    youtubeVideoId: "",
    youtubeApiKey: "",
    kickUser: "",
  });
  const [messages, setMessages] = useState<Map<string, WebsocketMessageData>>(
    new Map()
  );

  useEffect(() => {
    const client = new WebSocket("ws://localhost:1348");

    client.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      const {
        id,
        name,
        provider,
        isSub,
        isMod,
        isOwner,
        badges,
        badgesRaw,
        emotes,
        emotesRaw,
        message,
        channelName,
      } = data;
      setMessages((messages) => {
        messages.set(id, {
          id,
          name,
          provider,
          isSub,
          isMod,
          isOwner,
          badges,
          badgesRaw,
          emotes,
          emotesRaw,
          message,
          channelName,
        });
        return new Map(messages);
      });
    });

    client.addEventListener("error", (error) => {
      console.error("WebSocket error: ", error);
    });

    client.addEventListener("close", () => {
      console.info("WebSocket connection closed");
    });

    axios
      .get("https://api.betterttv.net/3/cached/emotes/global")
      .then((res) => {
        setBetterEmotes(res.data);
      });

    axios.get("https://api.frankerfacez.com/v1/set/global").then((res) => {
      const sets = res.data.sets as Record<string, { emoticons: FFEmotes[] }>;
      for (const set of Object.values(sets)) {
        setFrankerFaceZEmotes((emotes) => [...emotes, ...set.emoticons]);
      }
    });
  }, []);

  const openConfigModal = async () => {
    try {
      setLoading(true);
      const data = axios
        .get("http://localhost:1349/api/get-config")
        .then((res) => res.data);
      const { twitchUser, youtubeVideoId, youtubeApiKey, kickUser } =
        await data;
      setDefaultValues({
        twitchUser,
        youtubeVideoId,
        youtubeApiKey,
        kickUser,
      });
      setConfigModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeConfigModal = () => {
    setConfigModalOpen(false);
  };

  const saveConfig = async (
    twitchUser: string,
    youtubeVideoId: string,
    youtubeApiKey: string,
    kickUser: string
  ) => {
    try {
      setLoading(true);
      const configData = {
        twitchUser,
        youtubeVideoId,
        youtubeApiKey,
        kickUser,
        kickUserChatroom: "",
      };

      let getChatRoomResponse;

      if (kickUser !== "") {
        getChatRoomResponse = await axios.post(
          "http://localhost:1349/api/get-kick-user-chatroom",
          { kickUser },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      configData.kickUserChatroom = getChatRoomResponse?.data.kickUserChatroom;

      axios.post("http://localhost:1349/api/update-config", configData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setConfigModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const trashMessages = () => {
    setMessages(new Map());
  };

  useEffect(() => {
    if (messages.size > 80) {
      const firstMessage = messages.values().next().value;
      messages.delete(firstMessage.id);
      setMessages(new Map(messages));
    }

    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.addEventListener("scroll", () => {
        //  in range of 20 pixels
        if (
          container.scrollTop + container.offsetHeight >=
          container.scrollHeight - 20
        ) {
          setAutoScroll(true);
        } else {
          setAutoScroll(false);
        }
      });
    }

    const container = messagesContainerRef.current;
    if (container && autoScroll) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, autoScroll]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Button
        variant="outline"
        size="icon"
        className="top-2 right-2 absolute"
        onClick={openConfigModal}
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="top-2 right-14 absolute"
        onClick={trashMessages}
      >
        <Trash className="h-4 w-4" />
      </Button>

      <div
        ref={messagesContainerRef}
        className="flex flex-col w-[85%] h-[80%] rounded-2xl p-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary scrollbar-track-background"
      >
        {Array.from(messages.values()).map((message, index) => (
          <Message
            key={index}
            name={message.name}
            provider={message.provider}
            isSub={message.isSub}
            isMod={message.isMod}
            isOwner={message.isOwner}
            badges={message.badges}
            badgesRaw={message.badgesRaw}
            emotes={message.emotes}
            emotesRaw={message.emotesRaw}
            channelName={message.channelName}
            message={message.message}
            betterEmotes={betterEmotes}
            frankerFaceZEmotes={frankerFaceZEmotes}
            className="mb-2"
          />
        ))}
      </div>
      {isConfigModalOpen && (
        <ConfigModal
          closeConfigModal={closeConfigModal}
          saveConfig={saveConfig}
          defaultValues={defaultValues}
        />
      )}
      {isLoading && (
        <div className="fixed z-50 flex justify-center items-center w-screen h-screen bg-gray-600 bg-opacity-30">
          <Spinner className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default App;
