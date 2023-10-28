import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { VersionData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const version = "v1.1.0";

export const getChattyVersion = async (): Promise<VersionData> => {
  const url =
    "https://api.github.com/repos/SimaoMoreira5228/Chatty/releases/latest";

  const { data } = await axios.get(url);

  if (data?.tag_name === version) {
    return {
      version: version,
      latestVersion: data?.tag_name,
      isOutdated: false,
      lastestVersionURL: data?.html_url,
    };
  } else {
    return {
      version: version,
      latestVersion: data?.tag_name,
      isOutdated: true,
      lastestVersionURL: data?.html_url,
    };
  }
};
