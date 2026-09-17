import type { InstagramMediaItem } from "@/types";

interface InstagramGridProps {
  items: InstagramMediaItem[];
}

export default function InstagramGrid({ items }: InstagramGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.permalink}
          target="_blank"
          rel="noreferrer noopener"
          className="group relative aspect-square overflow-hidden rounded-md bg-bg-surface"
        >
          <img
            src={item.thumbnailUrl ?? item.mediaUrl}
            alt={item.caption ?? "Publicación de Instagram"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {item.mediaType === "VIDEO" && (
            <span className="absolute right-2 top-2 text-white drop-shadow">▶</span>
          )}
        </a>
      ))}
    </div>
  );
}
