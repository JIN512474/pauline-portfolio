import PageHeader from "@/components/page-header";

const items = [
  { title: "Lookbook Landing", desc: "Next.js + Tailwind, smooth scroll & CMS ready" },
  { title: "Brand Microsite", desc: "High-speed portfolio, video-first hero, SEO baseline" },
  { title: "Booking Funnel", desc: "Inquiry form, pricing packages, calendar handoff" },
];

export default function WebDevPage() {
  return (
    <div className="px-5 md:px-10 pt-24 pb-14">
      <div className="max-w-6xl mx-auto">
        <PageHeader title="WEB DEVELOPMENT" subtitle="포트폴리오/브랜드 사이트 제작" />
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft"
            >
              <div className="text-xs tracking-wide2 text-white/70">DELIVERABLE</div>
              <div className="mt-2 text-lg">{it.title}</div>
              <div className="mt-2 text-sm text-white/70 leading-relaxed">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
