import { useQuery } from "@tanstack/react-query";
import type { TikTokVideo } from "@/types";
import { isDemoMode } from "@/lib/runtime";

async function fetchTikTokVideos(): Promise<TikTokVideo[]> {
  if (isDemoMode) return [];

  const res = await fetch("/api/tiktok-videos");
  if (!res.ok) throw new Error("No se pudieron obtener los videos de TikTok");
  return res.json();
}

export function useTikTokVideos() {
  return useQuery({
    queryKey: ["tiktok", "videos"],
    queryFn: fetchTikTokVideos,
    staleTime: 30 * 60_000,
  });
}
