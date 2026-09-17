const NAV_LINKS = [
  { href: "#twitch", label: "Twitch" },
  { href: "#youtube", label: "YouTube" },
  { href: "#instagram", label: "Instagram" },
  { href: "#tiktok", label: "TikTok" },
  { href: "#comunidad", label: "Comunidad" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="font-display text-2xl tracking-wide text-text-primary">
          UPMINA
        </a>

        <nav className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-accent-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="https://twitch.tv/upminaa"
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-text-inverse shadow-glow-primary transition-transform hover:scale-105"
        >
          Ver en Twitch
        </a>
      </div>
    </header>
  );
}
