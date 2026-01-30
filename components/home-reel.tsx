import Link from "next/link";

type ReelItem = {
  title: string;
  subtitle: string;
  videoSrc: string;
  href: string;
};

const items: ReelItem[] = [
  {
    title: "Portrait Series",
    subtitle: "PEOPLE · STUDIO",
    videoSrc: "/hero.mp4",
    href: "/portfolio",
  },
  {
    title: "Campaign Mood",
    subtitle: "BRAND · EDITORIAL",
    videoSrc: "/hero.mp4",
    href: "/portfolio",
  },
  {
    title: "Product Visuals",
    subtitle: "PRODUCT · DETAIL",
    videoSrc: "/hero.mp4",
    href: "/portfolio",
  },
];

export default function HomeReel() {
  return (
    <div className="pt-16">
      {items.map((it, idx) => (
        <section key={it.title + idx} className="relative h-[92vh] min-h-[640px] overflow-hidden grain">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
          >
            <source src={it.videoSrc} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_45%)]" />

          <div className="relative px-5 md:px-10 h-full flex items-end pb-14">
            <div className="max-w-6xl mx-auto w-full">
              <div className="text-xs tracking-wide2 text-white/70">PAULINE</div>
              <div className="mt-3 text-4xl md:text-6xl leading-[0.95] tracking-tight">
                {it.title}
              </div>
              <div className="mt-3 text-sm text-white/70">{it.subtitle}</div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={it.href}
                  className="rounded-full px-5 py-3 text-sm bg-white text-black hover:bg-white/90 transition"
                >
                  VIEW PROJECT
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full px-5 py-3 text-sm border border-white/30 hover:border-white/60 transition"
                >
                  INQUIRIES
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
