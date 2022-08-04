import { getEnvVarOrThrow } from "./utils";
import "dotenv/config";

export const config = {
  youtubeOauthClientId: getEnvVarOrThrow("YOUTUBE_OAUTH_CLIENT_ID"),
  youtubeOauthClientSecret: getEnvVarOrThrow("YOUTUBE_OAUTH_CLIENT_SECRET"),
  youtubeOauthRefreshToken: getEnvVarOrThrow("YOUTUBE_OAUTH_REFRESH_TOKEN"),
  youtubeChannelId: getEnvVarOrThrow("YOUTUBE_CHANNEL_ID"),
  pathToFolderWithVideos: getEnvVarOrThrow("PATH_TO_FOLDER_WITH_VIDEOS"),
};
