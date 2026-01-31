"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import PortfolioLightbox from "@/components/portfolio-lightbox";

type Project = {
  id: string;
  title: string;
  cover: string;
  images: string[];
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // lightbox
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/portfolio-projects", { cache: "no-store" });
        const data = (await res.json()) as { projects: Project[] };
        if (!alive) return;

        // API에서 이미 역순 정렬하지만, 방어적으로 한 번 더
        const list = Array.isArray(data.projects) ? data.projects : [];
        setProjects(list);
      } catch {
        if (!alive) return;
        setProjects([]);
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

  const openProject = (p: Project, idx = 0) => {
    setActive(p);
    setStartIndex(Math.max(0, Math.min(idx, p.images.length - 1)));
    setOpen(true);
  };

  // 그리드: 모바일 2열 / PC 3열
  const gridClass =
    "grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-3";

  // “사진만” 보여주기: 타이틀/뱃지/카운트 제거
  const cards = useMemo(() => projects, [projects]);

  return (
    <div className="px-5 md:px-10 pt-24 pb-16">
      {/* 상단: 풀네임 영어 + 큰 포트폴리오만 */}
      <div className="max-w-6xl mx-auto">
        <div className="text-xs tracking-[0.22em] text-white/55">PAULINE GUILLET</div>
        <h1 className="mt-3 text-3xl md:text-4xl text-white">포트폴리오</h1>
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        {loading && (
          <div className="text-white/50 text-sm">Loading...</div>
        )}

        {!loading && cards.length === 0 && (
          <div className="text-white/50 text-sm">
            public/portfolio/&lt;project-folder&gt;/ 안에 이미지를 넣으면 자동으로 생성됩니다.
          </div>
        )}

        <div className={gridClass}>
          {cards.map((p, idx) => {
            const cover = p.cover || p.images[0] || "";

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => openProject(p, 0)}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 focus:outline-none"
                aria-label="Open project"
              >
                <div className="relative aspect-[4/5]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      quality={75}
                      loading={idx < 2 ? "eager" : "lazy"}
                      priority={idx < 2}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/5" />
                  )}
                  {/* 아주 미세한 오버레이만 (텍스트 없음) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <PortfolioLightbox
        open={open}
        title="" // 제목 표시 안함 (요청대로 “사진만”)
        images={active?.images ?? []}
        startIndex={startIndex}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}