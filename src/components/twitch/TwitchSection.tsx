import { useTwitchStatus } from "@/hooks/useTwitchStatus";
import { useTwitchClips } from "@/hooks/useTwitchClips";
import LiveBadge from "./LiveBadge";
import TwitchPlayer from "./TwitchPlayer";
import TwitchClip from "./TwitchClip";

const CHANNEL = "upminaa";

export default function TwitchSection() {
  const { data: status, isLoading: statusLoading } = useTwitchStatus();
  const { data: clips, isLoading: clipsLoading } = useTwitchClips();

  return (
    <section id="twitch" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-3xl tracking-wide">TWITCH</h2>
        {!statusLoading && status && (
          <LiveBadge isLive={status.isLive} viewerCount={status.viewerCount} />
        )}
      </div>

      {status?.isLive && (
        <div className="mb-10">
          <TwitchPlayer channel={CHANNEL} />
          {status.title && (
            <p className="mt-3 text-text-secondary">{status.title}</p>
          )}
        </div>
      )}

      <h3 className="mb-4 text-lg font-semibold text-text-primary">
        Últimos clips
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clipsLoading && (
          <p className="text-text-muted">Cargando clips…</p>
        )}
        {clips?.map((clip) => (
          <TwitchClip key={clip.id} clip={clip} />
        ))}
      </div>
    </section>
  );
}
