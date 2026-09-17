import { useQuery } from "@tanstack/react-query";
import type { YouTubeVideo } from "@/types";

async function fetchYouTubeVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  const res = await fetch(`/api/youtube-videos?maxResults=${maxResults}`);
  if (!res.ok) throw new Error("No se pudieron obtener los videos de YouTube");
  return res.json();
}

async function fetchLatestYouTubeVideo(): Promise<YouTubeVideo> {
  const res = await fetch("/api/youtube-latest");
  if (!res.ok) throw new Error("No se pudo obtener el último video de YouTube");
  return res.json();
}

export function useYouTubeVideos(maxResults = 12) {
  return useQuery({
    queryKey: ["youtube", "videos", maxResults],
    queryFn: () => fetchYouTubeVideos(maxResults),
    staleTime: 15 * 60_000,
  });
}

export function useLatestYouTubeVideo() {
  return useQuery({
    queryKey: ["youtube", "latest"],
    queryFn: fetchLatestYouTubeVideo,
    staleTime: 15 * 60_000,
  });
}
