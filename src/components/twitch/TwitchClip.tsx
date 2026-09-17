import type { TwitchClip as TwitchClipType } from "@/types";

interface TwitchClipProps {
  clip: TwitchClipType;
}

export default function TwitchClip({ clip }: TwitchClipProps) {
  const parent = typeof window !== "undefined" ? window.location.hostname : "localhost";

  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
      <div className="aspect-video">
        <iframe
          src={`${clip.embedUrl}&parent=${parent}`}
          title={clip.title}
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-text-primary">
          {clip.title}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {clip.viewCount.toLocaleString("es")} vistas
        </p>
      </div>
    </div>
  );
}
