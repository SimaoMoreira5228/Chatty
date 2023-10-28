import { type Message, type ConfigMessage } from "./types";
import fs from "fs";

// put the file into a folder called chatty on the appdata folder
export const configFileUrl = `${process.env.APPDATA}/chatty/config.json`;

export const messageParser = (message: Buffer): Message => {
  let messageToString = "";
  if (Buffer.isBuffer(message)) {
    messageToString = message.toString("utf-8");
  }

  if (!messageToString) {
    throw new Error("Message is not a string");
  }

  let parsedMessage: Message;
  try {
    parsedMessage = JSON.parse(messageToString);
    return parsedMessage;
  } catch (error) {
    throw new Error("Error parsing message");
  }
};

export const messageBuilder = (message: Message): Buffer => {
  const messageToString = JSON.stringify(message);
  const messageToBuffer = Buffer.from(messageToString);
  return messageToBuffer;
};

export const updateConfig = (message: ConfigMessage) => {
  const configData = message;
  if (!configData) {
    throw new Error("configData is missing in message of type 'config'");
  }

  const configDataString = JSON.stringify(configData);
  fs.writeFileSync(configFileUrl, configDataString);
};

export const readConfig = (): ConfigMessage => {
  if (!fs.existsSync(configFileUrl)) {
    const configData: ConfigMessage = {
      twitchUser: "",
      youtubeVideoId: "",
      youtubeApiKey: "",
      kickUser: "",
      kickUserChatroom: "",
    };
    updateConfig(configData);
  }

  const configDataString = fs.readFileSync(configFileUrl, "utf-8");
  const configData = JSON.parse(configDataString);
  return configData;
};
