"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/app/providers";

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
          ? data.images.filter((x) => typeof x === "string" && x.trim().length > 0)
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

  const scrollToIndex = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    if (images.length === 0) return;

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

      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width * 0.5;

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const s of slides) {
        const r = s.getBoundingClientRect();
        const center = r.left + r.width * 0.5;
        const dist = Math.abs(center - trackCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = Number(s.dataset.slide || 0);
        }
      }

      setActive(bestIdx);
    };

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [images.length]);

  // ✅ 1안 멘트 (KR/EN 자동 전환)
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

  return (
    <section className="py-16 md:py-20 border-b border-white/10">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-2">
          <div className="text-xs tracking-wide2 text-white/60">PROFILE</div>
        </div>

        {/* Mobile: image first */}
        <div className="lg:hidden">
          <ProfilePreviewCard
            lang={lang}
            images={images}
            loading={loading}
            active={active}
            hasCarousel={hasCarousel}
            trackRef={trackRef}
            scrollToIndex={scrollToIndex}
          />
        </div>

        <div className="lg:col-span-6">
          <h2 className="text-2xl md:text-4xl leading-tight max-w-3xl">{title}</h2>
          <p className="mt-5 text-white/70 leading-relaxed max-w-2xl">{desc}</p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/profile"
              className="rounded-full px-6 py-3 text-sm bg-white text-black hover:bg-white/90 transition"
            >
              {lang === "KR" ? "프로필 보기" : "View Profile"}
            </Link>

            <Link
              href="/contact"
              className="rounded-full px-6 py-3 text-sm border border-white/30 hover:border-white/60 transition"
            >
              {lang === "KR" ? "문의" : "Inquiries"}
            </Link>
          </div>
        </div>

        {/* Desktop: image right */}
        <div className="hidden lg:block lg:col-span-4">
          <ProfilePreviewCard
            lang={lang}
            images={images}
            loading={loading}
            active={active}
            hasCarousel={hasCarousel}
            trackRef={trackRef}
            scrollToIndex={scrollToIndex}
          />
        </div>
      </div>
    </section>
  );
}

function ProfilePreviewCard({
  lang,
  images,
  loading,
  active,
  hasCarousel,
  trackRef,
  scrollToIndex,
}: {
  lang: "KR" | "EN";
  images: string[];
  loading: boolean;
  active: number;
  hasCarousel: boolean;
  trackRef: React.RefObject<HTMLDivElement | null>;
  scrollToIndex: (idx: number) => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-soft">
      <div className="relative">
        {(loading || images.length === 0) && (
          <div className="relative aspect-[4/5] bg-black/25">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />
            <div className="absolute left-5 bottom-5 text-sm text-white/70">
              {loading
                ? lang === "KR"
                  ? "프로필 이미지 로딩 중..."
                  : "Loading profile images..."
                : lang === "KR"
                ? "public/profile 폴더에 이미지를 넣어주세요."
                : "Add images to public/profile/"}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div
            ref={trackRef}
            className="homeProfileTrack relative flex overflow-x-scroll scroll-smooth snap-x snap-mandatory"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            }}
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
                    alt={`Home profile ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {hasCarousel && (
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

      <style jsx>{`
        .homeProfileTrack {
          scrollbar-width: none;
        }
        .homeProfileTrack::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
