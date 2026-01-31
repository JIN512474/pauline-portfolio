"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import PortfolioLightbox from "@/components/portfolio-lightbox";

type Project = {
  id: string;
  cover: string;
  images: string[];
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // lightbox state
  const [open, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/portfolio-projects", { cache: "no-store" });
        const data = (await res.json()) as { projects?: Project[] };
        const list = Array.isArray(data.projects) ? data.projects : [];
        if (!alive) return;
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

  const items = useMemo(() => projects ?? [], [projects]);

  const openProject = (p: Project, idx = 0) => {
    setActiveProject(p);
    setStartIndex(Math.max(0, Math.min(idx, p.images.length - 1)));
    setOpen(true);
  };

  return (
    <div className="px-5 md:px-10 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header (요청: 풀네임 영어 + 큰 포트폴리오만) */}
        <div className="text-xs tracking-[0.28em] text-white/55">PAULINE GUILLET</div>
        <h1 className="mt-3 text-3xl md:text-5xl text-white/95">포트폴리오</h1>

        {/* Grid (요청: 사진만 / 모바일 2열) */}
        <div className="mt-10">
          {loading && (
            <div className="text-white/45 text-sm">Loading…</div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-white/45 text-sm">
              public/portfolio/&lt;폴더&gt; 안에 이미지를 넣으면 자동으로 표시됩니다.
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {items.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => openProject(p, 0)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft block"
                aria-label="Open portfolio"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={p.cover}
                    alt=""
                    fill
                    priority={false}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.01]"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        <PortfolioLightbox
          open={open}
          images={activeProject?.images ?? []}
          startIndex={startIndex}
          onClose={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
