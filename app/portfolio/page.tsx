"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLang } from "@/app/providers";

export default function PortfolioPage() {
  const { lang } = useLang();

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/portfolio-images", { cache: "no-store" });
        const data = (await res.json()) as { images?: string[] };
        const list = Array.isArray(data.images) ? data.images : [];
        if (!alive) return;
        setImages(list);
      } catch {
        if (!alive) return;
        setImages([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="px-5 md:px-10 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-xs tracking-wide2 text-white/55">PAULINE</div>
        <h1 className="mt-3 text-3xl md:text-4xl">{lang === "KR" ? "포트폴리오" : "Portfolio"}</h1>
        <p className="mt-3 text-white/60">
          {lang === "KR" ? "선별 작업" : "Selected works"}
        </p>

        <div className="mt-10">
          {(loading || images.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft text-sm text-white/70">
              {loading
                ? lang === "KR"
                  ? "로딩 중..."
                  : "Loading..."
                : lang === "KR"
                ? "public/portfolio 폴더에 이미지를 넣으면 자동으로 표시됩니다."
                : "Add images to public/portfolio to display them here."}
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {images.map((src, idx) => (
                <div
                  key={src}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-soft"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={src}
                      alt={`Work ${idx + 1}`}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
