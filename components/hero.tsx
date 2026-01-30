"use client";

import Link from "next/link";
import { useLang } from "@/app/providers";

export default function Hero() {
  const { lang } = useLang();

  return (
    <section id="hero" className="relative h-[92vh] min-h-[640px] overflow-hidden grain">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-75"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_45%)]" />

      <div className="relative px-5 md:px-10 pt-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-wide2 text-white/70">
            {lang === "KR" ? "서울, 대한민국" : "Seoul, Korea"}
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl leading-[0.95] tracking-tight">
            Pauline Guillet
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/portfolio"
              className="rounded-full px-5 py-3 text-sm bg-white text-black hover:bg-white/90 transition"
            >
              {lang === "KR" ? "포트폴리오 보기" : "View Portfolio"}
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-5 py-3 text-sm border border-white/30 hover:border-white/60 transition"
            >
              {lang === "KR" ? "문의하기" : "Bookings & Inquiries"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
