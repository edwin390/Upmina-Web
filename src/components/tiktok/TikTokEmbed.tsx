import { TikTokEmbed as ReactTikTokEmbed } from "react-social-media-embed";
import type { TikTokVideo } from "@/types";

interface TikTokEmbedProps {
  video: TikTokVideo;
}

export default function TikTokEmbed({ video }: TikTokEmbedProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
      <ReactTikTokEmbed url={video.embedUrl} width="100%" />
    </div>
  );
}
