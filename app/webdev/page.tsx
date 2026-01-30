import PageHeader from "@/components/page-header";

export default function WebDevPage() {
  const items = [
    {
      title: "Portfolio Site",
      descKR: "모델/포토그래퍼 포트폴리오 사이트",
      descEN: "Portfolio website for model/photographer",
    },
    {
      title: "Brand Site",
      descKR: "브랜드/룩북 랜딩 페이지",
      descEN: "Brand / lookbook landing page",
    },
    {
      title: "Booking / Contact",
      descKR: "문의/예약 흐름 최적화",
      descEN: "Optimized contact/booking flow",
    },
  ];

  return (
    <div className="px-5 md:px-10 pt-24 pb-14">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          titleKR="웹 개발"
          titleEN="Web Development"
          subtitleKR="포트폴리오/브랜드 사이트 제작"
          subtitleEN="Portfolio / brand website builds"
        />

        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft"
            >
              <div className="text-sm">{it.title}</div>
              <div className="mt-3 text-sm text-white/70 leading-relaxed">
                {it.descKR}
              </div>
              <div className="mt-2 text-xs text-white/45">{it.descEN}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
