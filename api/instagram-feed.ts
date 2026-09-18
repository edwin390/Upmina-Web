import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { InstagramApiItem } from "./types";

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const fields = "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp";
    const mediaRes = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=${fields}&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=24`,
    );

    if (!mediaRes.ok) throw new Error(`Instagram respondió ${mediaRes.status}`);

    const { data } = (await mediaRes.json()) as { data?: InstagramApiItem[] };

    const items = (data ?? []).map((item) => ({
      id: item.id,
      mediaType: item.media_type,
      mediaUrl: item.media_url,
      thumbnailUrl: item.thumbnail_url ?? item.media_url,
      permalink: item.permalink,
      caption: item.caption,
      timestamp: item.timestamp,
    }));

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=7200");
    return res.status(200).json(items);
  } catch (err) {
    console.error("[instagram-feed]", err);
    return res.status(502).json({ error: "No se pudo obtener el feed de Instagram" });
  }
}
