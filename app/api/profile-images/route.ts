import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function isValidImageFilename(name: string) {
  const base = path.basename(name);
  if (base.startsWith("._")) return false; // macOS AppleDouble
  if (base.startsWith(".")) return false;  // dotfiles
  const ext = path.extname(base).toLowerCase();
  return ALLOWED_EXT.has(ext);
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "profile");
    if (!fs.existsSync(dir)) return NextResponse.json({ images: [] });

    const files = fs
      .readdirSync(dir)
      .filter((f) => isValidImageFilename(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = files.map((f) => `/profile/${f}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
