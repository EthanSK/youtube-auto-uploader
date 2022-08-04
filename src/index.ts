import "dotenv/config";
import { config } from "./config";
import {
  calcDateToScheduleNextVideo,
  generateTitleFromVideoFileName,
  getAllVideosOnChannel,
  getVideoInfo,
  uploadVideo,
} from "./youtube";
import { getFilesInDir } from "./utils";
import path from "path";

async function run() {
  console.log("path to videos folder: ", config.pathToFolderWithVideos);

  const allVidsOnChannel = await getAllVideosOnChannel(config.youtubeChannelId);

  console.log(
    `There are currently ${allVidsOnChannel.length} videos on the channel with id ${config.youtubeChannelId}`
  );
  const channelVideoInfos = await getVideoInfo(
    allVidsOnChannel
      .filter((el) => el.contentDetails?.videoId)
      .map((el) => el.contentDetails!.videoId!)
  );

  const videoFiles = await getFilesInDir(
    config.pathToFolderWithVideos,
    "random"
  );

  const videoToUpload = videoFiles.find(
    (file) =>
      !channelVideoInfos
        .map((el) => el.snippet?.title)
        .includes(generateTitleFromVideoFileName(file))
  );

  console.log("Video to upload: ", videoToUpload);

  if (!videoToUpload) {
    console.warn("No new videos to upload! Skipping...");
    return; //return instead of throw so program can run again later in case there have been more videos added to folder
  }

  const dateToScheduleNextVideo =
    calcDateToScheduleNextVideo(channelVideoInfos);

  console.log("Date to schedule next video: ", dateToScheduleNextVideo);

  const uploadVideoRes = await uploadVideo({
    filePath: path.join(config.pathToFolderWithVideos, videoToUpload),
    title: generateTitleFromVideoFileName(videoToUpload),
    description: config.youtubeVideoDescription,
    scheduledDate: dateToScheduleNextVideo,
    tags: config.youtubeVideoTags,
    categoryId: config.youtubeVideoCategoryId,
    defaultAudioLanguage: config.youtubeVideoAudioLanguage,
    defaultLanguage: config.youtubeVideoTitleAndDescriptionLanguage,
    playlistIds: config.youtubeVideoPlaylistIds,
    madeForKids: config.youtubeVideoMadeForKids,
  });

  console.log("Uploaded video with ID ", uploadVideoRes.id);
}

async function runPeriodic() {
  while (true) {
    console.log("Running program at ", new Date().toISOString());
    try {
      await run();
    } catch (error) {
      console.error(error);
    }
    console.log("Program run complete!");
    console.log(
      "Next program run is set for ",
      new Date(
        Date.now() + config.secsBetweenRunningProgram * 1000
      ).toISOString()
    );
    await new Promise((resolve) =>
      setTimeout(resolve, config.secsBetweenRunningProgram * 1000)
    );
  }
}

runPeriodic();
