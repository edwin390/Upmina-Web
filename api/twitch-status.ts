import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { TwitchStream, TwitchTokenResponse } from "../src/types/api.js";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL ?? "upminaa";

let cachedToken: { token: string; expiresAt: number } | null = null;

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = await getAppAccessToken();

    const streamRes = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${TWITCH_CHANNEL}`,
      {
        headers: {
          "Client-Id": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!streamRes.ok) {
      throw new Error(`Twitch respondió ${streamRes.status}`);
    }

    const { data } = (await streamRes.json()) as { data?: TwitchStream[] };
    const stream = data?.[0];

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");

    if (!stream) {
      return res.status(200).json({ isLive: false });
    }

    return res.status(200).json({
      isLive: true,
      title: stream.title,
      viewerCount: stream.viewer_count,
      thumbnailUrl: stream.thumbnail_url
        .replace("{width}", "440")
        .replace("{height}", "248"),
      startedAt: stream.started_at,
    });
  } catch (err) {
    console.error("[twitch-status]", err);
    return res.status(502).json({ error: "No se pudo obtener el estado de Twitch" });
  }
}
