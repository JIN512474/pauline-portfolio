import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type Project = {
  id: string;
  title: string;
  cover: string;
  images: string[];
};

function isJunkFile(name: string) {
  // macOS resource fork + DS_Store + hidden files
  return (
    name === ".DS_Store" ||
    name.startsWith("._") ||
    name.startsWith(".") ||
    name.toLowerCase() === "thumbs.db"
  );
}

function isImageFile(name: string) {
  const n = name.toLowerCase();
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".webp") || n.endsWith(".avif");
}

function numericFolderSortDesc(a: string, b: string) {
  // folder-12, folder 12, 12 등 숫자가 있으면 숫자로 내림차순
  const na = Number((a.match(/\d+/g) || ["-1"]).pop());
  const nb = Number((b.match(/\d+/g) || ["-1"]).pop());
  if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return nb - na;
  return b.localeCompare(a, "en");
}

function numericFileSortAsc(a: string, b: string) {
  const na = Number((a.match(/\d+/g) || ["-1"]).pop());
  const nb = Number((b.match(/\d+/g) || ["-1"]).pop());
  if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
  return a.localeCompare(b, "en");
}

export async function GET() {
  const portfolioRoot = path.join(process.cwd(), "public", "portfolio");

  let folders: string[] = [];
  try {
    folders = fs
      .readdirSync(portfolioRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .filter((n) => !isJunkFile(n))
      .sort(numericFolderSortDesc);
  } catch {
    const res = NextResponse.json({ projects: [] as Project[] }, { status: 200 });
    res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res;
  }

  const projects: Project[] = folders
    .map((folderName) => {
      const abs = path.join(portfolioRoot, folderName);
      let files: string[] = [];
      try {
        files = fs
          .readdirSync(abs, { withFileTypes: true })
          .filter((d) => d.isFile())
          .map((d) => d.name)
          .filter((n) => !isJunkFile(n))
          .filter(isImageFile)
          .sort(numericFileSortAsc);
      } catch {
        files = [];
      }

      const images = files.map((f) => `/portfolio/${folderName}/${f}`);
      const cover = images[0] || "";

      return {
        id: folderName,
        title: folderName,
        cover,
        images,
      };
    })
    .filter((p) => p.images.length > 0);

  const res = NextResponse.json({ projects }, { status: 200 });
  // Vercel Edge/Server cache
  res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res;
}