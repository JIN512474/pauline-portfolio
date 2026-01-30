import Image from "next/image";

type Item = {
  title: string;
  meta: string;
  src: string;
};

const items: Item[] = [
  { title: "Portrait Series 1", meta: "PEOPLE · STUDIO", src: "/ph/01.jpg" },
  { title: "Portrait Series 2", meta: "PEOPLE · STUDIO", src: "/ph/02.jpg" },
  { title: "Portrait Series 3", meta: "PEOPLE · STUDIO", src: "/ph/03.jpg" },
  { title: "Portrait Series 4", meta: "PEOPLE · STUDIO", src: "/ph/04.jpg" },
  { title: "Portrait Series 5", meta: "PEOPLE · STUDIO", src: "/ph/05.jpg" },
  { title: "Portrait Series 6", meta: "PEOPLE · STUDIO", src: "/ph/06.jpg" },
];

export default function PortfolioGrid() {
  return (
    <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <article
          key={it.title}
          className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-soft"
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={it.src}
              alt={it.title}
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0" />
          </div>
          <div className="p-5">
            <div className="text-xs tracking-wide2 text-white/60">{it.meta}</div>
            <div className="mt-2 text-lg">{it.title}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
