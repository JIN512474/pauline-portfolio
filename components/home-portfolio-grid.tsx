"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/app/providers";

export default function HomePortfolioGrid() {
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
        const list = Array.isArray(data.images)
          ? data.images.filter((x) => typeof x === "string" && x.trim().length > 0)
          : [];
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
    <section className="py-16 md:py-20">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-2">
          <div className="text-xs tracking-wide2 text-white/60">PORTFOLIO</div>
        </div>

        <div className="lg:col-span-10">
          {/* Empty / loading state */}
          {(loading || images.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft text-sm text-white/70">
              {loading
                ? lang === "KR"
                  ? "포트폴리오 로딩 중..."
                  : "Loading portfolio..."
                : lang === "KR"
                ? "public/portfolio 폴더에 이미지를 넣으면 자동으로 그리드가 생성됩니다."
                : "Add images to public/portfolio and the grid will populate automatically."}
            </div>
          )}

          {/* Grid: 모바일 2열 고정 */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {images.map((src, idx) => {
                return (
                  <Link key={src} href="/portfolio" className="block">
                    <div className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-soft">
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={src}
                          alt={`Portfolio ${idx + 1}`}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                      </div>

                      <div className="p-3">
                        <div className="text-[11px] tracking-wide2 text-white/55">
                          {lang === "KR" ? "포트폴리오" : "Portfolio"}
                        </div>
                        <div className="mt-1 text-sm text-white/85">
                          {lang === "KR" ? `작업 ${idx + 1}` : `Work ${idx + 1}`}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
