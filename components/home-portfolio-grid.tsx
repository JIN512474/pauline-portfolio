"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  cover: string;
  images: string[];
};

export default function HomePortfolioGrid() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        const res = await fetch("/api/portfolio-projects", { cache: "no-store" });
        const data = (await res.json()) as { projects?: Project[] };
        const list = Array.isArray(data.projects) ? data.projects : [];
        if (!alive) return;
        setProjects(list);
      } catch {
        if (!alive) return;
        setProjects([]);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => (projects ?? []).slice(0, 4), [projects]);

  return (
    <div className="mt-10">
      {/* 요청: 사진의 하얀부분(이전 느낌) → 섹션 상단에 큰 PORTFOLIO 타이틀만 */}
      <div className="mb-4">
        <div className="text-xs tracking-[0.28em] text-white/55">PAULINE GUILLET</div>
        <div className="mt-2 text-2xl md:text-3xl text-white/95">PORTFOLIO</div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {items.map((p) => (
          <Link
            key={p.id}
            href="/portfolio"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft block"
            aria-label="Go to portfolio"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={p.cover}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-[1.01]"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
