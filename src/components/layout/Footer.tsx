const SOCIAL_LINKS = [
  { href: "https://twitch.tv/upminaa", label: "Twitch" },
  { href: "https://www.youtube.com/@upminaa", label: "YouTube" },
  { href: "https://www.instagram.com/upminaa/?hl=es", label: "Instagram" },
  { href: "https://www.tiktok.com/@upminaa.cos?lang=es", label: "TikTok" },
  { href: "https://www.reddit.com/user/upminaa/", label: "Reddit" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-surface py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-text-secondary">
        <div className="flex flex-wrap gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-accent-secondary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-text-muted">
          UPMINA Web es un proyecto no oficial creado por fans. No está
          afiliado, patrocinado ni respaldado por UPMINA ni por su
          management. Consulta el{" "}
          <a href="/docs/LEGAL.md" className="underline hover:text-accent-primary">
            aviso legal
          </a>
          .
        </p>

        <p className="text-text-muted">
          &copy; {new Date().getFullYear()} UPMINA Web — Distribuido bajo
          licencia MIT.
        </p>
      </div>
    </footer>
  );
}
