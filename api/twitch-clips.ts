import type { VercelRequest, VercelResponse } from "@vercel/node";
import type {
  TwitchClipApiItem,
  TwitchTokenResponse,
  TwitchUser,
} from "../src/types/api.js";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL ?? "upminaa";

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedBroadcasterId: string | null = null;

async function getAppAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) throw new Error("No se pudo autenticar con Twitch");
  const data = (await res.json()) as TwitchTokenResponse;

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

async function getBroadcasterId(token: string): Promise<string> {
  if (cachedBroadcasterId) return cachedBroadcasterId;

  const res = await fetch(`https://api.twitch.tv/helix/users?login=${TWITCH_CHANNEL}`, {
    headers: {
      "Client-Id": TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudo resolver el canal de Twitch");
  const { data } = (await res.json()) as { data?: TwitchUser[] };
  cachedBroadcasterId = data?.[0]?.id ?? null;
  if (!cachedBroadcasterId) throw new Error("Canal de Twitch no encontrado");
  return cachedBroadcasterId;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getAppAccessToken();
    const broadcasterId = await getBroadcasterId(token);

    const clipsRes = await fetch(
      `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&first=12`,
      {
        headers: {
          "Client-Id": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!clipsRes.ok) throw new Error(`Twitch respondió ${clipsRes.status}`);

    const { data } = (await clipsRes.json()) as { data?: TwitchClipApiItem[] };
    const parent = req.headers.host ?? "localhost";

    const clips = (data ?? []).map((clip) => ({
      id: clip.id,
      title: clip.title,
      embedUrl: `https://clips.twitch.tv/embed?clip=${clip.id}&parent=${parent}`,
      thumbnailUrl: clip.thumbnail_url,
      viewCount: clip.view_count,
      createdAt: clip.created_at,
    }));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(clips);
  } catch (err) {
    console.error("[twitch-clips]", err);
    return res.status(502).json({ error: "No se pudieron obtener los clips de Twitch" });
  }
}
