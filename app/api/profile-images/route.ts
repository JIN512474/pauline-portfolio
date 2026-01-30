import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

// 너무 작은 파일(깨진/빈 파일) 필터링용 (8KB)
const MIN_BYTES = 8 * 1024;

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "profile");

    if (!fs.existsSync(dir)) {
      const res = NextResponse.json({ images: [] }, { status: 200 });
      res.headers.set("Cache-Control", "no-store");
      return res;
    }

    const files = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      // 숨김 파일/시스템 파일 제거 (macOS .DS_Store 등)
      .filter((name) => !name.startsWith("."))
      // 확장자 필터
      .filter((name) => ALLOWED_EXT.has(path.extname(name).toLowerCase()))
      // 0바이트/깨진 파일/너무 작은 파일 제거
      .filter((name) => {
        try {
          const full = path.join(dir, name);
          const st = fs.statSync(full);
          return st.size >= MIN_BYTES;
        } catch {
          return false;
        }
      })
      // 숫자 파일명 정렬(01,02,10...) + fallback 이름 정렬
      .sort((a, b) => {
        const na = parseInt(a.match(/\d+/)?.[0] ?? "", 10);
        const nb = parseInt(b.match(/\d+/)?.[0] ?? "", 10);
        const aHasNum = Number.isFinite(na);
        const bHasNum = Number.isFinite(nb);
        if (aHasNum && bHasNum) return na - nb;
        if (aHasNum && !bHasNum) return -1;
        if (!aHasNum && bHasNum) return 1;
        return a.localeCompare(b);
      });

    const images = files.map((f) => `/profile/${f}`);

    const res = NextResponse.json({ images }, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    const res = NextResponse.json({ images: [] }, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
}
