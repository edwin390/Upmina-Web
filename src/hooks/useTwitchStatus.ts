import { useQuery } from "@tanstack/react-query";
import type { TwitchStatus } from "@/types";
import { isDemoMode } from "@/lib/runtime";

async function fetchTwitchStatus(): Promise<TwitchStatus> {
  if (isDemoMode) return { isLive: false };

  const res = await fetch("/api/twitch-status");
  if (!res.ok) throw new Error("No se pudo obtener el estado de Twitch");
  return res.json();
}

export function useTwitchStatus() {
  return useQuery({
    queryKey: ["twitch", "status"],
    queryFn: fetchTwitchStatus,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
