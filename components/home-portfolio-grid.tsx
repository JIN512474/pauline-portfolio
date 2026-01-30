"use client";

import SwapTile from "@/components/swap-tile";
import { useLang } from "@/app/providers";

export default function HomePortfolioGrid() {
  const { lang } = useLang();

  const items =
    lang === "KR"
      ? [
          {
            title: "NEW BALANCE",
            meta: "룩북 · 캠페인",
            href: "/portfolio",
            frontSrc: "/ph/01.jpg",
            backSrc: "/ph/02.jpg",
          },
          {
            title: "Project LINDA",
            meta: "에디토리얼 · 포트레이트",
            href: "/portfolio",
            frontSrc: "/ph/03.jpg",
            backSrc: "/ph/04.jpg",
          },
          {
            title: "Chaser 88",
            meta: "아트 · 커머셜",
            href: "/portfolio",
            frontSrc: "/ph/05.jpg",
            backSrc: "/ph/06.jpg",
          },
        ]
      : [
          {
            title: "NEW BALANCE",
            meta: "LOOKBOOK · CAMPAIGN",
            href: "/portfolio",
            frontSrc: "/ph/01.jpg",
            backSrc: "/ph/02.jpg",
          },
          {
            title: "Project LINDA",
            meta: "EDITORIAL · PORTRAIT",
            href: "/portfolio",
            frontSrc: "/ph/03.jpg",
            backSrc: "/ph/04.jpg",
          },
          {
            title: "Chaser 88",
            meta: "ART · COMMERCIAL",
            href: "/portfolio",
            frontSrc: "/ph/05.jpg",
            backSrc: "/ph/06.jpg",
          },
        ];

  return (
    <section className="py-16 md:py-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs tracking-wide2 text-white/60">
            PORTFOLIO
          </div>
          <h3 className="mt-3 text-2xl md:text-3xl">
            {lang === "KR" ? "선별 작업" : "Selected Works"}
          </h3>
        </div>

        <div className="text-sm text-white/60 hidden md:block">
          {lang === "KR" ? "호버 시 스왑 →" : "Hover to swap →"}
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <SwapTile
            key={item.title}
            title={item.title}
            meta={item.meta}
            href={item.href}
            frontSrc={item.frontSrc}
            backSrc={item.backSrc}
          />
        ))}
      </div>
    </section>
  );
}
