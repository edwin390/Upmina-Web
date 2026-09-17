interface TwitchPlayerProps {
  channel: string;
}

export default function TwitchPlayer({ channel }: TwitchPlayerProps) {
  const parent = typeof window !== "undefined" ? window.location.hostname : "localhost";
  const src = `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=true`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-border-subtle">
      <iframe
        src={src}
        title="Twitch live player"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
