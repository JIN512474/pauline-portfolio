"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/app/providers";

export default function ProfileCard() {
  const { lang } = useLang();

  const trackRef = useRef<HTMLDivElement | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  const specs =
    lang === "KR"
      ? [
          { k: "키", v: "170 cm" },
          { k: "몸무게", v: "49 kg" },
          { k: "사이즈", v: "32 - 25 - 37" },
          { k: "신발", v: "240 - 250" },
          { k: "출생년도", v: "2003" },
        ]
      : [
          { k: "HEIGHT", v: "170 cm" },
          { k: "WEIGHT", v: "49 kg" },
          { k: "SIZE", v: "32 - 25 - 37" },
          { k: "SHOES", v: "240 - 250" },
          { k: "BIRTH YEAR", v: "2003" },
        ];

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

  const notes =
    lang === "KR"
      ? [
          { k: "국적", v: "프랑스" },
          { k: "체류 비자", v: "E6 비자" },
          { k: "거주지", v: "서울, 대한민국" },
        ]
      : [
          { k: "NATIONALITY", v: "France" },
          { k: "VISA", v: "E6 Visa" },
          { k: "RESIDENCE", v: "Seoul, South Korea" },
        ];

  return (
    <section className="mt-10 grid lg:grid-cols-12 gap-6">
      {/* LEFT: Profile carousel */}
      <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-soft">
        <div className="relative">
          {(loading || images.length === 0) && (
            <div className="relative aspect-[4/5] bg-black/25">
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
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
              className="profileTrack relative flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {images.map((src, i) => (
                <div key={src} data-slide={i} className="relative w-full shrink-0 snap-start">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={src}
                      alt={`Profile ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
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
          .profileTrack {
            scrollbar-width: none;
          }
          .profileTrack::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* RIGHT: Specs + Notes */}
      <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="text-xs tracking-wide2 text-white/60">
          {lang === "KR" ? "신체 스펙" : "BODY SPECS"}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {specs.map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4"
            >
              <div className="text-xs tracking-wide2 text-white/55">{s.k}</div>
              <div className="mt-2 text-xl">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="text-xs tracking-wide2 text-white/60 mb-4">
            {lang === "KR" ? "추가 정보" : "NOTES"}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {notes.map((n) => (
              <div
                key={n.k}
                className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4"
              >
                <div className="text-xs tracking-wide2 text-white/55">{n.k}</div>
                <div className="mt-2 text-lg">{n.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
