import { getEnvVarOrThrow } from "./utils";
import "dotenv/config";

export const config = {
  youtubeOauthClientId: getEnvVarOrThrow("YOUTUBE_OAUTH_CLIENT_ID"),
  youtubeOauthClientSecret: getEnvVarOrThrow("YOUTUBE_OAUTH_CLIENT_SECRET"),
  youtubeOauthRefreshToken: getEnvVarOrThrow("YOUTUBE_OAUTH_REFRESH_TOKEN"),
  youtubeChannelId: getEnvVarOrThrow("YOUTUBE_CHANNEL_ID"),
  pathToFolderWithVideos: getEnvVarOrThrow("PATH_TO_FOLDER_WITH_VIDEOS"),
  sortOrderOfVideoFiles: getEnvVarOrThrow("SORT_ORDER_OF_VIDEO_FILES"),
  numYoutubeVideosToPostAtOnce: getEnvVarOrThrow<number>(
    "NUM_YOUTUBE_VIDEOS_TO_POST_AT_ONCE"
  ),
  secsBetweenVideoScheduleDate: getEnvVarOrThrow<number>(
    "SECS_BETWEEN_DATE_VIDEOS_ARE_SCHEDULED"
  ),
  secsBetweenRunningProgram: getEnvVarOrThrow<number>(
    "SECS_BETWEEN_RUNNING_PROGRAM"
  ),
};
