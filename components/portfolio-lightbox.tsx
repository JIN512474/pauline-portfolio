"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  open: boolean;
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

export default function PortfolioLightbox({ open, images, startIndex = 0, onClose }: Props) {
  const safeImages = useMemo(() => images ?? [], [images]);
  const [active, setActive] = useState(Math.max(0, Math.min(startIndex, safeImages.length - 1)));

  // swipe
  const startXRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, Math.min(startIndex, safeImages.length - 1)));
  }, [open, startIndex, safeImages.length]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setActive((v) => Math.max(0, v - 1));
      if (e.key === "ArrowRight") setActive((v) => Math.min(safeImages.length - 1, v + 1));
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, safeImages.length]);

  if (!open) return null;
  if (safeImages.length === 0) return null;

  const canPrev = active > 0;
  const canNext = active < safeImages.length - 1;

  const goPrev = () => setActive((v) => Math.max(0, v - 1));
  const goNext = () => setActive((v) => Math.min(safeImages.length - 1, v + 1));

  const swallow = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const startX = startXRef.current;
    startXRef.current = null;

    if (startX == null) return;
    const dx = e.clientX - startX;

    // threshold
    if (Math.abs(dx) < 40) return;
    if (dx > 0 && canPrev) goPrev();
    if (dx < 0 && canNext) goNext();
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-[2px] flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full h-full max-w-6xl max-h-[92vh] mx-auto px-4 md:px-8 flex items-center justify-center"
        onClick={swallow}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: "pan-y" }}
      >
        {/* Close */}
        <button
          type="button"
          onPointerDown={swallow}
          onClick={(e) => {
            swallow(e);
            onClose();
          }}
          className="absolute right-4 top-4 z-30 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white/90 w-10 h-10 flex items-center justify-center"
          aria-label="Close"
          style={{ touchAction: "manipulation" }}
        >
          ✕
        </button>

        {/* Prev */}
        <button
          type="button"
          onPointerDown={swallow}
          onClick={(e) => {
            swallow(e);
            if (canPrev) goPrev();
          }}
          disabled={!canPrev}
          aria-label="Previous image"
          className={[
            "absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full",
            "bg-black/45 border border-white/18 w-11 h-11 flex items-center justify-center",
            "text-white/85 hover:text-white hover:border-white/30 transition pointer-events-auto",
            !canPrev ? "opacity-30 cursor-not-allowed" : "opacity-100",
          ].join(" ")}
          style={{ touchAction: "manipulation" }}
        >
          ‹
        </button>

        {/* Next */}
        <button
          type="button"
          onPointerDown={swallow}
          onClick={(e) => {
            swallow(e);
            if (canNext) goNext();
          }}
          disabled={!canNext}
          aria-label="Next image"
          className={[
            "absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full",
            "bg-black/45 border border-white/18 w-11 h-11 flex items-center justify-center",
            "text-white/85 hover:text-white hover:border-white/30 transition pointer-events-auto",
            !canNext ? "opacity-30 cursor-not-allowed" : "opacity-100",
          ].join(" ")}
          style={{ touchAction: "manipulation" }}
        >
          ›
        </button>

        {/* Image */}
        <div className="relative w-full h-full max-h-[88vh]">
          <Image
            src={safeImages[active]}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2">
          {safeImages.slice(0, 12).map((_, i) => (
            <button
              key={i}
              type="button"
              onPointerDown={swallow}
              onClick={(e) => {
                swallow(e);
                setActive(i);
              }}
              className={[
                "h-2 w-2 rounded-full border border-white/40",
                i === active ? "bg-white/80" : "bg-white/10",
              ].join(" ")}
              aria-label={`Go to image ${i + 1}`}
              style={{ touchAction: "manipulation" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
