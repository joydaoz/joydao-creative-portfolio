import axios from "axios";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  channelTitle: string;
}

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const CHANNEL_ID = "UC_W0mhBIPvxpCeM9VXJNraw"; // joydao.z channel ID

export async function getLatestUploads(limit: number = 3): Promise<YouTubeVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YOUTUBE_API_KEY not configured");
    }

    // Get the uploads playlist ID for the channel
    const channelResponse = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
      params: {
        part: "contentDetails",
        id: CHANNEL_ID,
        key: apiKey,
      },
    });

    const uploadsPlaylistId =
      channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error("Could not find uploads playlist");
    }

    // Get the latest videos from the uploads playlist
    const videosResponse = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
      params: {
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: limit,
        key: apiKey,
      },
    });

    const videos: YouTubeVideo[] = videosResponse.data.items?.map(
      (item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        channelTitle: item.snippet.channelTitle,
      })
    ) || [];

    return videos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}
