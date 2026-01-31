"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/app/providers";

export default function ProfilePage() {
  const { lang } = useLang();

  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
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

  const scrollToIndex = (idx: number) => {
    const track = trackRef.current;
    if (!track || images.length === 0) return;

    const clamped = Math.max(0, Math.min(idx, images.length - 1));
    const slide = track.querySelector<HTMLDivElement>(`[data-slide="${clamped}"]`);
    if (!slide) return;

    slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (images.length <= 1) return;

    const onScroll = () => {
      const slides = Array.from(track.querySelectorAll<HTMLDivElement>("[data-slide]"));
      if (slides.length === 0) return;

      const rect = track.getBoundingClientRect();
      const center = rect.left + rect.width * 0.5;

      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const s of slides) {
        const r = s.getBoundingClientRect();
        const c = r.left + r.width * 0.5;
        const d = Math.abs(c - center);
        if (d < bestDist) {
          bestDist = d;
          best = Number(s.dataset.slide || 0);
        }
      }
      setActive(best);
    };

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [images.length]);

  return (
    <div className="px-5 md:px-10 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-xs tracking-wide2 text-white/55">PAULINE</div>
        <h1 className="mt-3 text-3xl md:text-4xl">{lang === "KR" ? "프로필" : "Profile"}</h1>
        <p className="mt-3 text-white/60">
          {lang === "KR" ? "프로필 · 신체 스펙 · 기본 정보" : "Profile · Body specs · Info"}
        </p>

        <div className="mt-10 grid lg:grid-cols-12 gap-6 items-start">
          {/* Images */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-white/5 shadow-soft overflow-hidden">
            {(loading || images.length === 0) && (
              <div className="relative aspect-[4/5] bg-black/25" />
            )}

            {images.length > 0 && (
              <div className="relative">
                <div
                  ref={trackRef}
                  className="track flex overflow-x-scroll scroll-smooth snap-x snap-mandatory"
                  style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
                >
                  {images.map((src, i) => (
                    <div
                      key={src}
                      data-slide={i}
                      className="relative min-w-full shrink-0 snap-start"
                    >
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={src}
                          alt={`Profile ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority={i === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                      </div>
                    </div>
                  ))}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollToIndex(active - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 border border-white/15 px-3 py-2 text-white/80 hover:text-white hover:border-white/30 transition"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToIndex(active + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 border border-white/15 px-3 py-2 text-white/80 hover:text-white hover:border-white/30 transition"
                      aria-label="Next image"
                    >
                      ›
                    </button>

                    <div className="absolute left-0 right-0 bottom-4 flex justify-center gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => scrollToIndex(i)}
                          className={
                            "h-2 w-2 rounded-full border transition " +
                            (i === active
                              ? "bg-white/90 border-white/90"
                              : "bg-white/10 border-white/30 hover:bg-white/25")
                          }
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <style jsx>{`
              .track {
                scrollbar-width: none;
              }
              .track::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

          {/* Specs */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-white/5 shadow-soft p-6">
            <div className="text-xs tracking-wide2 text-white/55">
              {lang === "KR" ? "신체 스펙" : "Body Specs"}
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <Spec labelKR="키" labelEN="Height" value="170cm" />
              <Spec labelKR="몸무게" labelEN="Weight" value="49kg" />
              <Spec labelKR="사이즈" labelEN="Size" value="32-25-37" />
              <Spec labelKR="신발" labelEN="Shoes" value="240-250" />
              <Spec labelKR="출생년도" labelEN="Birth Year" value="2003" />
              <Spec labelKR="거주지" labelEN="Base" value="서울, 대한민국" />
              <Spec labelKR="국적" labelEN="Nationality" value="France" />
              <Spec labelKR="비자" labelEN="Visa" value="E-6" />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs tracking-wide2 text-white/55">
                {lang === "KR" ? "추가 정보" : "Additional"}
              </div>
              <div className="mt-3 text-sm text-white/70 leading-relaxed">
                {lang === "KR"
                  ? "프랑스 국적 · 대한민국 체류 비자(E-6)"
                  : "French nationality · Korea visa (E-6)"}
              </div>
            </div>
          </div>
        </div>
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
      <div className="text-[11px] tracking-wide2 text-white/55">{lang === "KR" ? labelKR : labelEN}</div>
      <div className="mt-2 text-lg text-white/90">{value}</div>
    </div>
  );
}
