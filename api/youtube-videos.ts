import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseIsoDuration } from "../src/lib/format";
import type {
  YouTubeChannelResponse,
  YouTubePlaylistResponse,
  YouTubeVideosResponse,
} from "./types";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const maxResults = Math.min(Number(req.query.maxResults) || 12, 50);

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
    );
    if (!channelRes.ok) throw new Error("No se pudo consultar el canal de YouTube");
    const channelData = (await channelRes.json()) as YouTubeChannelResponse;
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) throw new Error("Canal de YouTube no encontrado");

    const itemsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`,
    );
    if (!itemsRes.ok) throw new Error("No se pudieron obtener los videos");
    const itemsData = (await itemsRes.json()) as YouTubePlaylistResponse;
    const items = itemsData.items ?? [];

    const videoIds = items
      .map((item) => item.snippet.resourceId.videoId)
      .join(",");

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
    );
    const videosData = (await videosRes.json()) as YouTubeVideosResponse;
    const durationById = new Map<string, string>(
      (videosData.items ?? []).map((video) => [video.id, video.contentDetails.duration]),
    );

    const videos = items.map((item) => {
      const id = item.snippet.resourceId.videoId;
      return {
        id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        duration: parseIsoDuration(durationById.get(id) ?? "PT0S"),
      };
    });

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=1800");
    return res.status(200).json(videos);
  } catch (err) {
    console.error("[youtube-videos]", err);
    return res.status(502).json({ error: "No se pudieron obtener los videos de YouTube" });
  }
}
