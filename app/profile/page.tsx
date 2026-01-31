"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/providers";
import PortfolioLightbox from "@/components/portfolio-lightbox";

export default function ProfilePage() {
  const { lang } = useLang();

  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(0);

  // lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        const res = await fetch("/api/profile-images", { cache: "no-store" });
        const data = (await res.json()) as { images?: string[] };
        const list = Array.isArray(data.images) ? data.images : [];
        if (!alive) return;
        setImages(list);
        setActive(0);
      } catch {
        if (!alive) return;
        setImages([]);
        setActive(0);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  const safeImages = useMemo(() => images ?? [], [images]);
  const hasPrev = active > 0;
  const hasNext = active < safeImages.length - 1;

  const openLightbox = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, safeImages.length - 1));
    setStartIndex(clamped);
    setLightboxOpen(true);
  };

  return (
    <div className="px-5 md:px-10 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-xs tracking-[0.28em] text-white/55">PAULINE</div>
        <h1 className="mt-3 text-3xl md:text-5xl text-white/95">
          {lang === "KR" ? "프로필" : "Profile"}
        </h1>
        <p className="mt-3 text-white/60">
          {lang === "KR" ? "프로필 · 신체 스펙 · 기본 정보" : "Profile · Specs · Info"}
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Single image slider (1장만 보이고 좌우 넘김) */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative aspect-[4/5]">
                {safeImages[active] ? (
                  <button
                    type="button"
                    className="absolute inset-0 z-10"
                    onClick={() => openLightbox(active)}
                    aria-label="Open fullscreen"
                  />
                ) : null}

                {safeImages[active] ? (
                  <Image
                    src={safeImages[active]}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
                    {lang === "KR" ? "이미지가 없습니다" : "No images"}
                  </div>
                )}
              </div>

              {/* Prev/Next */}
              <button
                type="button"
                onClick={() => hasPrev && setActive((v) => v - 1)}
                disabled={!hasPrev}
                className={[
                  "absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full",
                  "bg-black/45 border border-white/18 w-11 h-11 flex items-center justify-center",
                  "text-white/85 hover:text-white hover:border-white/30 transition",
                  !hasPrev ? "opacity-30 cursor-not-allowed" : "opacity-100",
                ].join(" ")}
                aria-label="Previous"
                style={{ touchAction: "manipulation" }}
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => hasNext && setActive((v) => v + 1)}
                disabled={!hasNext}
                className={[
                  "absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full",
                  "bg-black/45 border border-white/18 w-11 h-11 flex items-center justify-center",
                  "text-white/85 hover:text-white hover:border-white/30 transition",
                  !hasNext ? "opacity-30 cursor-not-allowed" : "opacity-100",
                ].join(" ")}
                aria-label="Next"
                style={{ touchAction: "manipulation" }}
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                {safeImages.slice(0, 12).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={[
                      "h-2 w-2 rounded-full border border-white/40",
                      i === active ? "bg-white/80" : "bg-white/10",
                    ].join(" ")}
                    aria-label={`Go to ${i + 1}`}
                    style={{ touchAction: "manipulation" }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 text-xs text-white/45">
              {lang === "KR"
                ? "이미지를 클릭하면 전체화면으로 볼 수 있습니다."
                : "Click the image to open fullscreen."}
            </div>
          </div>

          {/* Right: Specs */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="text-white/70 text-sm">{lang === "KR" ? "기본 정보" : "Info"}</div>

                {/* France flag (SVG) */}
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <span
                    aria-hidden
                    className="inline-flex overflow-hidden rounded-sm border border-white/15"
                    style={{ width: 18, height: 12 }}
                  >
                    <span style={{ width: 6, height: 12, background: "#0055A4" }} />
                    <span style={{ width: 6, height: 12, background: "#FFFFFF" }} />
                    <span style={{ width: 6, height: 12, background: "#EF4135" }} />
                  </span>
                  France
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <Spec labelKR="키" labelEN="Height" value="170cm" />
                <Spec labelKR="몸무게" labelEN="Weight" value="49kg" />
                <Spec labelKR="사이즈" labelEN="Size" value="32-25-37" />
                <Spec labelKR="신발" labelEN="Shoes" value="240-250" />
                <Spec labelKR="출생년도" labelEN="Birth" value="2003" />
                <Spec labelKR="거주지" labelEN="Location" value="서울, 대한민국" />
                <Spec labelKR="비자" labelEN="Visa" value="E-6" />
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="text-white/60 text-xs tracking-wide">
                  {lang === "KR" ? "추가 정보" : "Notes"}
                </div>
                <div className="mt-2 text-white/80 text-sm">
                  {lang === "KR"
                    ? "프랑스 국적 · 대한민국 체류 비자(E-6)"
                    : "French nationality · Korea stay visa (E-6)"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Lightbox */}
        <PortfolioLightbox
          open={lightboxOpen}
          images={safeImages}
          startIndex={startIndex}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </div>
  );
}

function Spec({
  labelKR,
  labelEN,
  value,
}: {
  labelKR: string;
  labelEN: string;
  value: string;
}) {
  const { lang } = useLang();
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="text-[11px] tracking-wide text-white/55">
        {lang === "KR" ? labelKR : labelEN}
      </div>
      <div className="mt-2 text-lg text-white/90">{value}</div>
    </div>
  );
}
