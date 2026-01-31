import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Project = {
  id: string;        // folder name
  cover: string;     // first image url
  images: string[];  // all image urls
};

function isImageFile(name: string) {
  const lower = name.toLowerCase();
  return (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".gif")
  );
}

function isHiddenOrMacJunk(name: string) {
  return name.startsWith(".") || name.startsWith("._") || name === ".ds_store";
}

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function folderSortDesc(a: string, b: string) {
  // 숫자 폴더면 숫자 기준 내림차순, 아니면 문자열 내림차순
  const na = Number(a.replace(/[^\d]/g, ""));
  const nb = Number(b.replace(/[^\d]/g, ""));
  const bothNumeric = Number.isFinite(na) && Number.isFinite(nb) && (/\d/.test(a) || /\d/.test(b));
  if (bothNumeric) return nb - na;
  return b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" });
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const baseDir = path.join(publicDir, "portfolio");

    if (!fs.existsSync(baseDir)) {
      return NextResponse.json({ projects: [] });
    }

    const folders = fs
      .readdirSync(baseDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .filter((name) => !isHiddenOrMacJunk(name))
      .sort(folderSortDesc);

    const projects: Project[] = [];

    for (const folder of folders) {
      const folderPath = path.join(baseDir, folder);
      const files = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((f) => f.isFile())
        .map((f) => f.name)
        .filter((name) => !isHiddenOrMacJunk(name))
        .filter(isImageFile)
        .sort(naturalSort);

      if (files.length === 0) continue;

      const images = files.map((f) => `/portfolio/${folder}/${f}`);
      projects.push({
        id: folder,
        cover: images[0],
        images,
      });
    }

    return NextResponse.json({ projects });
  } catch (e) {
    return NextResponse.json({ projects: [], error: "failed_to_scan_portfolio" }, { status: 500 });
  }
}
