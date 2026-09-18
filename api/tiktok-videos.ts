import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { TikTokApiVideo } from "../src/types/api.js";

// El access token de TikTok caduca cada 24h; se asume renovado por un cron
// job separado que actualiza TIKTOK_ACCESS_TOKEN vía refresh token.
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const listRes = await fetch(
      "https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url,share_url,create_time",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ max_count: 12 }),
      },
    );

    if (!listRes.ok) throw new Error(`TikTok respondió ${listRes.status}`);

    const { videos } = (await listRes.json()) as { videos?: TikTokApiVideo[] };

    const mappedVideos = (videos ?? []).map((video) => ({
      id: video.id,
      title: video.title,
      embedUrl: video.share_url,
      coverImageUrl: video.cover_image_url,
      createTime: new Date(video.create_time * 1000).toISOString(),
    }));

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    return res.status(200).json(mappedVideos);
  } catch (err) {
    console.error("[tiktok-videos]", err);
    return res.status(502).json({ error: "No se pudieron obtener los videos de TikTok" });
  }
}
