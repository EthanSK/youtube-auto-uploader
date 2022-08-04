import { google, youtube_v3 } from "googleapis";
import { PLAYLIST_PAGE_SIZE } from "./constants";

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
  return youtube.playlistItems
    .list({
      playlistId,
      pageToken: pageToken,
      maxResults: PLAYLIST_PAGE_SIZE,
      part: ["contentDetails", "status"],
    })
    .then((res) => {
      return res.data;
    });
}
