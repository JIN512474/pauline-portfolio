"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  open: boolean;
  title?: string;
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PortfolioLightbox({ open, title, images, startIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lockScrollY = useRef<number>(0);

  useEffect(() => {
    if (!open) return;
    setIndex(clamp(startIndex, 0, Math.max(0, images.length - 1)));
  }, [open, startIndex, images.length]);

  // body scroll lock (안정)
  useEffect(() => {
    if (!open) return;
    lockScrollY.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockScrollY.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      const y = top ? Math.abs(parseInt(top, 10)) : 0;
      window.scrollTo(0, y);
    };
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images.length]);

  // ±1 프리로드 (현재/다음/이전만)
  useEffect(() => {
    if (!open) return;
    const preload = (src?: string) => {
      if (!src) return;
      const img = new window.Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    };
    preload(images[index - 1]);
    preload(images[index + 1]);
  }, [open, index, images]);

  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const prev = () => setIndex((i) => clamp(i - 1, 0, images.length - 1));
  const next = () => setIndex((i) => clamp(i + 1, 0, images.length - 1));

  // 3장만 렌더: index-1, index, index+1
  const windowed = useMemo(() => {
    if (!open) return [];
    const list: { src: string; i: number }[] = [];
    for (const i of [index - 1, index, index + 1]) {
      if (i >= 0 && i < images.length) list.push({ src: images[i], i });
    }
    return list;
  }, [open, index, images]);

  if (!open) return null;

  const swallow = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm"
      onMouseDown={(e) => {
        // 바깥 클릭 닫기
        if (e.target === overlayRef.current) onClose();
      }}
      onTouchStart={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* Top Bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3">
        <div className="text-white/70 text-sm tracking-wide">{title || ""}</div>

        <button
          type="button"
          onPointerDown={swallow}
          onClick={(e) => {
            swallow(e);
            onClose();
          }}
          className="rounded-full border border-white/20 bg-black/30 px-3 py-2 text-white/80 hover:text-white hover:border-white/30"
          aria-label="Close"
          style={{ touchAction: "manipulation" }}
        >
          ✕
        </button>
      </div>

      {/* Main */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-14 pb-10">
        <div className="relative w-full max-w-5xl">
          {/* Prev button */}
          <button
            type="button"
            disabled={!hasPrev}
            onPointerDown={swallow}
            onClick={(e) => {
              swallow(e);
              if (hasPrev) prev();
            }}
            aria-label="Previous image"
            style={{ touchAction: "manipulation" }}
            className={[
              "absolute left-3 top-1/2 -translate-y-1/2 z-30 pointer-events-auto",
              "rounded-full bg-black/45 border border-white/18",
              "w-11 h-11 flex items-center justify-center",
              "text-white/85 hover:text-white hover:border-white/30 transition",
              hasPrev ? "opacity-100" : "opacity-30 cursor-not-allowed",
            ].join(" ")}
          >
            ‹
          </button>

          {/* Next button */}
          <button
            type="button"
            disabled={!hasNext}
            onPointerDown={swallow}
            onClick={(e) => {
              swallow(e);
              if (hasNext) next();
            }}
            aria-label="Next image"
            style={{ touchAction: "manipulation" }}
            className={[
              "absolute right-3 top-1/2 -translate-y-1/2 z-30 pointer-events-auto",
              "rounded-full bg-black/45 border border-white/18",
              "w-11 h-11 flex items-center justify-center",
              "text-white/85 hover:text-white hover:border-white/30 transition",
              hasNext ? "opacity-100" : "opacity-30 cursor-not-allowed",
            ].join(" ")}
          >
            ›
          </button>

          {/* Image stage */}
          <div className="relative mx-auto aspect-[4/5] max-h-[78vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            {/* 3장만 렌더 - translate로 전환 */}
            <div
              className="absolute inset-0 flex h-full w-full"
              style={{
                transform: `translateX(${windowed.length ? -(windowed.findIndex((x) => x.i === index) * 100) : 0}%)`,
                transition: "transform 220ms ease",
              }}
            >
              {windowed.map(({ src, i }) => (
                <div key={src} className="relative h-full w-full shrink-0">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 92vw, 70vw"
                    quality={88}
                    priority={i === index}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {images.slice(0, 12).map((_, i) => (
              <button
                key={i}
                type="button"
                onPointerDown={swallow}
                onClick={(e) => {
                  swallow(e);
                  setIndex(i);
                }}
                className={[
                  "h-2 w-2 rounded-full transition",
                  i === index ? "bg-white/80" : "bg-white/25 hover:bg-white/40",
                ].join(" ")}
                aria-label={`Go to image ${i + 1}`}
                style={{ touchAction: "manipulation" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}