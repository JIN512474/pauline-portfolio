"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/providers";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-6 h-6">
      <span
        className={
          "absolute left-0 top-1.5 h-[1.5px] w-6 bg-white/80 transition " +
          (open ? "translate-y-[6px] rotate-45" : "")
        }
      />
      <span
        className={
          "absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] w-6 bg-white/80 transition " +
          (open ? "opacity-0" : "opacity-100")
        }
      />
      <span
        className={
          "absolute left-0 bottom-1.5 h-[1.5px] w-6 bg-white/80 transition " +
          (open ? "-translate-y-[6px] -rotate-45" : "")
        }
      />
    </div>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();

  const [open, setOpen] = useState(false);

  // 라우트 이동 시 모바일 메뉴 자동 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 모바일 메뉴 열렸을 때 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links = useMemo(
    () => [
      { href: "/", labelKR: "HOME", labelEN: "HOME" },
      { href: "/profile", labelKR: "PROFILE", labelEN: "PROFILE" },
      { href: "/portfolio", labelKR: "PORTFOLIO", labelEN: "PORTFOLIO" },
      { href: "/contact", labelKR: "CONTACT", labelEN: "CONTACT" },
    ],
    []
  );

  const brand = "Pauline Guillet";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="px-5 md:px-10 pt-5">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="text-sm tracking-wide2 text-white/90">
              {brand}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-xs tracking-wide2 text-white/65">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={
                      "transition hover:text-white " +
                      (active ? "text-white" : "text-white/65")
                    }
                  >
                    {lang === "KR" ? l.labelKR : l.labelEN}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => setLang(lang === "KR" ? "EN" : "KR")}
                className="ml-2 rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/70 hover:text-white hover:border-white/35 transition"
                aria-label="Toggle language"
              >
                {lang === "KR" ? "KR" : "EN"}
              </button>
            </nav>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLang(lang === "KR" ? "EN" : "KR")}
                className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/70 hover:text-white hover:border-white/35 transition"
                aria-label="Toggle language"
              >
                {lang === "KR" ? "KR" : "EN"}
              </button>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="rounded-full border border-white/20 p-2 hover:border-white/35 transition"
                aria-label="Open menu"
              >
                <MenuIcon open={open} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-[82vw] max-w-[360px] bg-black border-l border-white/10 p-6">
            <div className="mt-16 space-y-6">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={
                      "block text-sm tracking-wide2 transition " +
                      (active ? "text-white" : "text-white/70 hover:text-white")
                    }
                  >
                    {lang === "KR" ? l.labelKR : l.labelEN}
                  </Link>
                );
              })}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-[11px] text-white/40">
              © 2026 PAULINE
              <div className="mt-1">By KWON JINCHAN</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
