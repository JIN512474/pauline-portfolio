"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/app/providers";

const LINKS = [
  { href: "/", labelKR: "홈", labelEN: "Home" },
  { href: "/profile", labelKR: "프로필", labelEN: "Profile" },
  { href: "/portfolio", labelKR: "포트폴리오", labelEN: "Portfolio" },
  { href: "/contact", labelKR: "문의", labelEN: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const { lang, toggleLang } = useLang();

  const isHome = pathname === "/";

  // 홈에서만 "히어로 구간 노출"을 사용
  const [inHero, setInHero] = useState(true);

  // 스크롤 시 살짝 페이드: 1.0 ~ 0.9
  const [fade, setFade] = useState(1);

  const ioRef = useRef<IntersectionObserver | null>(null);

  const active = useMemo(
    () => (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // (1) 스크롤 페이드 (모든 페이지 공통)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const t = Math.min(y / 260, 1);
      setFade(1 - 0.1 * t);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // (2) 히어로 구간에서만 보이기: 홈에서만 적용 + 라우트 이동 대응
  useEffect(() => {
    // 다른 페이지에서는 항상 표시
    if (!isHome) {
      setInHero(true);
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
      return;
    }

    // 홈인 경우: hero 관찰
    const hero = document.getElementById("hero");

    // hero가 없으면 안전하게 표시
    if (!hero) {
      setInHero(true);
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
      return;
    }

    // 기존 observer 정리
    if (ioRef.current) {
      ioRef.current.disconnect();
      ioRef.current = null;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setInHero(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    io.observe(hero);
    ioRef.current = io;

    return () => {
      io.disconnect();
      ioRef.current = null;
    };
  }, [isHome, pathname]);

  // 홈에서는 히어로 밖이면 숨김, 다른 페이지는 항상 표시
  const shouldShow = !isHome || inHero;

  if (!shouldShow) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="px-5 md:px-10">
        <div
          className="max-w-6xl mx-auto h-16 flex items-center justify-between pointer-events-auto"
          style={{ opacity: fade }}
        >
          <Link
            href="/"
            className="text-sm tracking-wide2 text-white/90 hover:text-white transition"
          >
            Pauline Guillet
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "hover:text-white transition " +
                  (active(l.href) ? "text-white" : "")
                }
              >
                {lang === "KR" ? l.labelKR : l.labelEN}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleLang}
            className="text-xs tracking-wide2 text-white/70 hover:text-white transition flex items-center gap-2"
            aria-label="Toggle language"
          >
            <span className={lang === "KR" ? "text-white" : "text-white/40"}>KR</span>
            <span className="text-white/30">/</span>
            <span className={lang === "EN" ? "text-white" : "text-white/40"}>EN</span>
          </button>
        </div>
      </div>
    </header>
  );
}
