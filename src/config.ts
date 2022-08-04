import { getEnvVarOrThrow } from "./utils";
import "dotenv/config";

export const config = {
  youtubeOauthClientId: getEnvVarOrThrow("YOUTUBE_OAUTH_CLIENT_ID"),
  youtubeOauthClientSecret: getEnvVarOrThrow("YOUTUBE_OAUTH_CLIENT_SECRET"),
  youtubeOauthRefreshToken: getEnvVarOrThrow("YOUTUBE_OAUTH_REFRESH_TOKEN"),
  youtubeChannelId: getEnvVarOrThrow("YOUTUBE_CHANNEL_ID"),
  pathToFolderWithVideos: getEnvVarOrThrow("PATH_TO_FOLDER_WITH_VIDEOS"),
  sortOrderOfVideoFiles: getEnvVarOrThrow("SORT_ORDER_OF_VIDEO_FILES"),

  secsBetweenVideoScheduleDate: getEnvVarOrThrow<number>(
    "SECS_BETWEEN_DATE_VIDEOS_ARE_SCHEDULED"
  ),
  secsBetweenRunningProgram: getEnvVarOrThrow<number>(
    "SECS_BETWEEN_RUNNING_PROGRAM"
  ),
  youtubeVideoCategoryId: getEnvVarOrThrow("YOUTUBE_VIDEO_CATEGORY_ID"),
  youtubeVideoTags: JSON.parse(
    process.env.YOUTUBE_VIDEO_TAGS ?? "[]"
  ) as string[],
  youtubeVideoDescription: process.env.YOUTUBE_VIDEO_DESCRIPTION,
  youtubeVideoTitleAndDescriptionLanguage:
    process.env.YOUTUBE_VIDEO_TITLE_AND_DESCRIPTION_LANGUAGE,
  youtubeVideoAudioLanguage: process.env.YOUTUBE_VIDEO_AUDIO_LANGUAGE,
  youtubeVideoPlaylistIds: JSON.parse(
    process.env.YOUTUBE_VIDEO_PLAYLIST_IDS ?? "[]"
  ) as string[],
  youtubeVideoMadeForKids: (process.env.YOUTUBE_VIDEO_MADE_FOR_KIDS ??
    false) as boolean,
};
