import PortfolioGrid from "@/components/portfolio-grid";
import PageHeader from "@/components/page-header";

export default function PortfolioPage() {
  return (
    <div className="px-5 md:px-10 pt-24 pb-14">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          titleKR="포트폴리오"
          titleEN="Portfolio"
          subtitleKR="인물 · 제품 · 캠페인 — 큐레이션된 시리즈"
          subtitleEN="People · Product · Campaign — Curated series"
        />
        <PortfolioGrid />
      </div>
    </div>
  );
}
