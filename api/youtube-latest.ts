import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseIsoDuration } from "../src/lib/format.js";
import type {
  YouTubeChannelResponse,
  YouTubePlaylistResponse,
  YouTubeVideosResponse,
} from "../src/types/api.js";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${YOUTUBE_API_KEY}`,
    );
    if (!itemsRes.ok) throw new Error("No se pudo obtener el último video");
    const itemsData = (await itemsRes.json()) as YouTubePlaylistResponse;
    const latest = itemsData.items?.[0];
    if (!latest) return res.status(404).json({ error: "Sin videos" });

    const videoId = latest.snippet.resourceId.videoId;

    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`,
    );
    const videoData = (await videoRes.json()) as YouTubeVideosResponse;
    const isoDuration = videoData.items?.[0]?.contentDetails?.duration ?? "PT0S";

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=1800");
    return res.status(200).json({
      id: videoId,
      title: latest.snippet.title,
      description: latest.snippet.description,
      thumbnailUrl:
        latest.snippet.thumbnails?.high?.url ?? latest.snippet.thumbnails?.default?.url,
      publishedAt: latest.snippet.publishedAt,
      duration: parseIsoDuration(isoDuration),
    });
  } catch (err) {
    console.error("[youtube-latest]", err);
    return res
      .status(502)
      .json({ error: "No se pudo obtener el último video de YouTube" });
  }
}
