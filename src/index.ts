import "dotenv/config";
import { google } from "googleapis";
import { config } from "./config";
import {
  calcDateToScheduleNextVideo,
  getAllVideosInPlaylist,
  getAllVideosOnChannel,
  getVideoInfo,
} from "./youtube";
import fs from "fs-extra";
import { getFilesInDir } from "./utils";

async function run() {
  console.log("path to videos folder: ", config.pathToFolderWithVideos);

  const allVidsOnChannel = await getAllVideosOnChannel(config.youtubeChannelId);

  console.log(
    `There are currently ${allVidsOnChannel.length} videos on the channel with id ${config.youtubeChannelId}`
  );
  const videoInfos = await getVideoInfo(
    allVidsOnChannel
      .filter((el) => el.contentDetails?.videoId)
      .map((el) => el.contentDetails!.videoId!)
  );

  console.log(videoInfos, videoInfos?.length);

  const videoFiles = await getFilesInDir(
    config.pathToFolderWithVideos,
    "random"
  );

  const videoToUpload = videoFiles.find(
    (file) => !videoInfos.map((el) => el.fileDetails?.fileName).includes(file)
  );

  console.log("video to upload: ", videoToUpload);

  const dateToScheduleNextVideo = calcDateToScheduleNextVideo(videoInfos);

  //to convert the file name to a video title, we should keep the symbols tbh. just remove the .mp4, and upper case the start of each word actually nah fuck that we don't need to do that.
}

run();
