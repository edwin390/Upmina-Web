import { useQuery } from "@tanstack/react-query";
import type { TwitchClip } from "@/types";
import { isDemoMode } from "@/lib/runtime";

async function fetchTwitchClips(): Promise<TwitchClip[]> {
  if (isDemoMode) return [];

  const res = await fetch("/api/twitch-clips");
  if (!res.ok) throw new Error("No se pudieron obtener los clips de Twitch");
  return res.json();
}

export function useTwitchClips() {
  return useQuery({
    queryKey: ["twitch", "clips"],
    queryFn: fetchTwitchClips,
    staleTime: 5 * 60_000,
  });
}
