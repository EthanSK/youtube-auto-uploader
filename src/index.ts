import "dotenv/config";
import { google } from "googleapis";
import { config } from "./config";
import { getAllVideosOnChannel } from "./youtube";

async function run() {
  console.log("path to videos folder: ", config.pathToFolderWithVideos);

  const allVidsOnChannel = await getAllVideosOnChannel(config.youtubeChannelId);

  console.log(allVidsOnChannel, allVidsOnChannel.length);
}

run();
