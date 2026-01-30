import Link from "next/link";

const preview = [
  { title: "Portrait Series", tag: "PEOPLE · STUDIO", href: "/portfolio" },
  { title: "Campaign Mood", tag: "BRAND · EDITORIAL", href: "/portfolio" },
  { title: "Product Visuals", tag: "PRODUCT · DETAIL", href: "/portfolio" },
];

export default function PortfolioPreview() {
  return (
    <section className="pb-16">
      <div className="grid md:grid-cols-3 gap-4">
        {preview.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft hover:bg-white/7 transition"
          >
            <div className="text-xs tracking-wide2 text-white/60">{it.tag}</div>
            <div className="mt-3 text-xl">{it.title}</div>
            <div className="mt-3 text-sm text-white/70">
              시리즈 페이지로 이동 →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
