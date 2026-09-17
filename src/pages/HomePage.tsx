import TwitchSection from "@/components/twitch/TwitchSection";
import YouTubeSection from "@/components/youtube/YouTubeSection";
import InstagramSection from "@/components/instagram/InstagramSection";
import TikTokSection from "@/components/tiktok/TikTokSection";
import CommunitySection from "@/components/community/CommunitySection";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="font-display text-5xl tracking-wide text-text-primary md:text-7xl">
          UPMINA
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          Directos, contenido y comunidad — todo en un solo lugar.
        </p>
      </section>

      <TwitchSection />
      <YouTubeSection />
      <InstagramSection />
      <TikTokSection />
      <CommunitySection />
    </>
  );
}
