"use client";

import { useLang } from "@/app/providers";

export default function PageHeader({
  titleKR,
  titleEN,
  subtitleKR,
  subtitleEN,
}: {
  titleKR: string;
  titleEN: string;
  subtitleKR: string;
  subtitleEN: string;
}) {
  const { lang } = useLang();

  return (
    <div className="border-b border-white/10 pb-8">
      <div className="text-xs tracking-wide2 text-white/60">PAULINE</div>
      <h1 className="mt-4 text-4xl md:text-5xl tracking-tight">
        {lang === "KR" ? titleKR : titleEN}
      </h1>
      <p className="mt-3 text-white/70">
        {lang === "KR" ? subtitleKR : subtitleEN}
      </p>
    </div>
  );
}
