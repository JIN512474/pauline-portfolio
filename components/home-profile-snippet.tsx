"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/app/providers";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function HomeProfileSnippet() {
  const { lang } = useLang();

  const trackRef = useRef<HTMLDivElement | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/profile-images", { cache: "no-store" });
        const data = (await res.json()) as { images?: string[] };
        const list = Array.isArray(data.images)
          ? data.images
              .filter((x) => typeof x === "string" && x.trim().length > 0)
              .filter((x) => !x.includes("/._")) // 안전망
          : [];
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

  const hasCarousel = images.length > 1;

  const clampIndex = (idx: number) => {
    if (images.length === 0) return 0;
    return Math.max(0, Math.min(idx, images.length - 1));
  };

  const scrollToIndex = (idx: number) => {
    const track = trackRef.current;
    if (!track || images.length === 0) return;

    const clamped = clampIndex(idx);
    const slide = track.querySelector<HTMLDivElement>(`[data-slide="${clamped}"]`);
    if (!slide) return;

    slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActive(clamped);
  };

  // ✅ active 자동 추적 (모바일에서도 안정적으로 동작)
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

  const swallow = (e: React.PointerEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const title = useMemo(() => {
    return lang === "KR"
      ? "브랜드와 사람 사이, 감정이 남는 비주얼."
      : "Visuals that leave an emotional trace between brands and people.";
  }, [lang]);

  const desc = useMemo(() => {
    return lang === "KR"
      ? "움직임과 표정, 그리고 순간의 밀도를 담습니다."
      : "Capturing movement, expression, and the density of a moment.";
  }, [lang]);

  const arrowBase = cx(
    "absolute top-1/2 -translate-y-1/2 z-30 pointer-events-auto",
    "rounded-full bg-black/45 border border-white/18",
    "w-11 h-11 flex items-center justify-center",
    "text-white/85 hover:text-white hover:border-white/30 transition"
  );

  return (
    <section className="py-20 border-b border-white/10">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6">
          <h2 className="text-3xl md:text-4xl leading-tight">{title}</h2>
          <p className="mt-5 text-white/70">{desc}</p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/profile"
              className="rounded-full px-6 py-3 bg-white text-black text-sm hover:bg-white/90 transition"
            >
              {lang === "KR" ? "프로필 보기" : "View Profile"}
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-6 py-3 border border-white/30 text-sm hover:border-white/60 transition"
            >
              {lang === "KR" ? "문의" : "Contact"}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-soft">
            {(loading || images.length === 0) && (
              <div className="relative aspect-[4/5] bg-black/25" />
            )}

            {images.length > 0 && (
              <div
                ref={trackRef}
                className="homeProfileTrack relative flex overflow-x-scroll snap-x snap-mandatory scroll-smooth"
                style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
              >
                {images.map((src, i) => (
                  <div
                    key={src}
                    data-slide={i}
                    className="min-w-full snap-start relative aspect-[4/5]"
                  >
                    <Image
                      src={src}
                      alt={`Home profile ${i + 1}`}
                      fill
                      className="object-cover"
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ✅ 모바일 버튼 클릭 우선순위 + 음수 인덱스 방지 */}
            {hasCarousel && (
              <>
                <button
                  type="button"
                  onPointerDown={swallow}
                  onClick={(e) => {
                    swallow(e);
                    scrollToIndex(active - 1);
                  }}
                  className={cx(arrowBase, "left-3")}
                  style={{ touchAction: "manipulation" }}
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onPointerDown={swallow}
                  onClick={(e) => {
                    swallow(e);
                    scrollToIndex(active + 1);
                  }}
                  className={cx(arrowBase, "right-3")}
                  style={{ touchAction: "manipulation" }}
                  aria-label="Next image"
                >
                  ›
                </button>

                {/* dots (터치 이동도 같이 안정화) */}
                <div className="absolute left-0 right-0 bottom-4 z-30 pointer-events-auto flex justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onPointerDown={swallow}
                      onClick={(e) => {
                        swallow(e);
                        scrollToIndex(i);
                      }}
                      className={cx(
                        "h-2.5 w-2.5 rounded-full border transition",
                        i === active
                          ? "bg-white/90 border-white/90"
                          : "bg-white/10 border-white/30 hover:bg-white/25"
                      )}
                      style={{ touchAction: "manipulation" }}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            <style jsx>{`
              .homeProfileTrack {
                scrollbar-width: none;
              }
              .homeProfileTrack::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
}