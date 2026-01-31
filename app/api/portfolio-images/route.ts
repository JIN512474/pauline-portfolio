import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "portfolio");
    if (!fs.existsSync(dir)) return NextResponse.json({ images: [] });

    const files = fs
      .readdirSync(dir)
      .filter((f) => ALLOWED_EXT.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = files.map((f) => `/portfolio/${f}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
