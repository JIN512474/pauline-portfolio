"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  title: string;
  cover: string;
  images: string[];
};

export default function HomePortfolioGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/portfolio-projects", { cache: "no-store" });
        const data = (await res.json()) as { projects: Project[] };
        if (!alive) return;

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

  // 홈에서는 4개만
  const top4 = useMemo(() => projects.slice(0, 4), [projects]);

  // 홈: 모바일 2열, PC는 2열 유지(요청: 홈도 2개씩)
  const gridClass = "grid grid-cols-2 gap-4 sm:gap-5";

  return (
    <section className="mt-14">
      {/* 요청: “사진 하얀 부분” 이전 버전처럼 포트폴리오 폰트 넣기
          => 카드 내부 오버레이 텍스트로 처리 (프로젝트 단위 문구는 제외)
      */}
      <div className={gridClass}>
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 aspect-[4/5]"
            />
          ))}

        {!loading &&
          top4.map((p, idx) => {
            const cover = p.cover || p.images[0] || "";

            return (
              <Link
                key={p.id}
                href="/portfolio"
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 block"
                aria-label="Open portfolio"
              >
                <div className="relative aspect-[4/5]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                      sizes="(max-width: 768px) 50vw, 50vw"
                      quality={75}
                      loading={idx < 2 ? "eager" : "lazy"}
                      priority={idx < 2}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/5" />
                  )}

                  {/* 아래 텍스트 오버레이(이전 버전 감성) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
                  <div className="absolute left-0 right-0 bottom-0 p-5">
                    <div className="text-[11px] tracking-[0.22em] text-white/70">
                      PORTFOLIO
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
}