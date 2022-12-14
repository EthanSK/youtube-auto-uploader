import { google, youtube_v3 } from "googleapis";
import { config } from "./config";
import { PLAYLIST_MAX_PAGE_SIZE, VIDEOS_MAX_PAGE_SIZE } from "./constants";
import fs from "fs-extra";
import path from "path";

const auth = new google.auth.OAuth2({
  clientId: process.env.YOUTUBE_OAUTH_CLIENT_ID,
  clientSecret: process.env.YOUTUBE_OAUTH_CLIENT_SECRET,
});

auth.setCredentials({
  refresh_token: process.env.YOUTUBE_OAUTH_REFRESH_TOKEN,
});

export const youtube = google.youtube({
  version: "v3",
  auth,
});

export async function getAllVideosOnChannel(channelId: string) {
  const channels = await youtube.channels.list({
    part: ["contentDetails"],
    id: [channelId],
  });
  const uploadsPlaylist =
    channels.data.items?.[0].contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylist)
    throw new Error("Couldn't get uploads playlist for channel");

  return getAllVideosInPlaylist(uploadsPlaylist); //if the refresh token we use is for the channel, the unpublished, scheduled videos will also be returned in the response
}

export async function getAllVideosInPlaylist(playlistId: string) {
  let items: youtube_v3.Schema$PlaylistItem[] = [];
  const firstPage = await getNextPageInPlaylist(playlistId);
  let nextPageToken = firstPage.nextPageToken;
  items = [...items, ...(firstPage.items ?? [])];

  while (nextPageToken) {
    const nextPage = await getNextPageInPlaylist(playlistId, nextPageToken);
    items = [...items, ...(nextPage.items ?? [])];
    nextPageToken = nextPage.nextPageToken;
  }

  return items;
}

export async function getNextPageInPlaylist(
  playlistId: string,
  pageToken?: string
) {
  const res = await youtube.playlistItems.list({
    playlistId,
    pageToken: pageToken,
    maxResults: PLAYLIST_MAX_PAGE_SIZE,
    part: ["contentDetails", "status"],
  });

  return res.data;
}

export async function getVideoInfo(videoIds: string[]) {
  let videosIdsRemaining = videoIds;
  let videoInfos: youtube_v3.Schema$Video[] = [];
  while (videosIdsRemaining.length > 0) {
    const res = await youtube.videos.list({
      id: videosIdsRemaining.slice(0, VIDEOS_MAX_PAGE_SIZE),
      part: ["status", "fileDetails", "snippet"],
    });

    videoInfos = [...videoInfos, ...(res.data.items ?? [])];

    videosIdsRemaining.splice(0, VIDEOS_MAX_PAGE_SIZE);
  }

  return videoInfos;
}

export function calcDateToScheduleNextVideo(
  existingVideos: youtube_v3.Schema$Video[]
) {
  const newestScheduledVideo = existingVideos.reduce((newestDate, next) => {
    if (!next.status?.publishAt) return newestDate;
    const nextDateScheduled = new Date(next.status.publishAt);
    return nextDateScheduled > newestDate ? nextDateScheduled : newestDate;
  }, new Date(0));

  let potentialDateToUse = new Date(
    newestScheduledVideo.getTime() + config.secsBetweenVideoScheduleDate * 1000
  );
  if (potentialDateToUse > new Date()) {
    return potentialDateToUse;
  }
  const newestPublishedVideo = existingVideos.reduce((newestDate, next) => {
    if (!next.snippet?.publishedAt) return newestDate;
    const nextDatePublished = new Date(next.snippet?.publishedAt);
    return nextDatePublished > newestDate ? nextDatePublished : newestDate;
  }, new Date(0));

  potentialDateToUse = new Date(
    newestPublishedVideo.getTime() + config.secsBetweenVideoScheduleDate * 1000
  );
  if (potentialDateToUse > new Date()) {
    return potentialDateToUse;
  }

  return new Date(Date.now() + config.secsBetweenVideoScheduleDate * 1000);

  //find newest scheduled video, defaulting to 0 if could not find.
  //if the newest date from last step + sched time is less than date.now(), we can't use it (coz it will try to schedule in past)
  //so we have to try and get the newest publishedAt time, and see if that + schedtime is > than date.now().
  //if not, we have to use date.now() + schedtime as the schedule date for the next video
}

async function addVideoToPlaylist(videoId: string, playlistId: string) {
  return youtube.playlistItems.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        playlistId,
        resourceId: { videoId, kind: "youtube#video" },
      },
    },
  });
}

export function generateTitleFromVideoFileName(fileName: string) {
  return path.parse(fileName).name.trim(); //need to trim coz youtube does that behind the scenes...
}

export async function uploadVideo(options: {
  filePath: string;
  title: string;
  scheduledDate: Date;
  description?: string;
  categoryId?: string;
  tags?: string[];
  defaultAudioLanguage?: string;
  defaultLanguage?: string;
  playlistIds?: string[];
  madeForKids: boolean;
}) {
  const {
    filePath,
    title,
    description,
    scheduledDate,
    categoryId,
    tags,
    defaultAudioLanguage,
    defaultLanguage,
    playlistIds,
    madeForKids,
  } = options;
  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description,
        categoryId,
        tags,
        defaultAudioLanguage,
        defaultLanguage,
      },
      status: {
        publishAt: scheduledDate.toISOString(),
        privacyStatus: "private",
        selfDeclaredMadeForKids: madeForKids,
      },
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  });

  if (res.data.id && (playlistIds?.length ?? 0) > 0) {
    for (const playlistId of playlistIds ?? []) {
      await addVideoToPlaylist(res.data.id, playlistId);
    }
  }

  return res.data;
}
