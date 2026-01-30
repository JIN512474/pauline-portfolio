import Image from "next/image";
import Link from "next/link";

export default function SwapTile({
  href,
  title,
  meta,
  frontSrc,
  backSrc,
}: {
  href: string;
  title: string;
  meta: string;
  frontSrc: string;
  backSrc: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-soft"
    >
      <div className="relative aspect-[16/10] md:aspect-[16/9]">
        {/* front */}
        <Image
          src={frontSrc}
          alt={title}
          fill
          className="object-cover opacity-95 transition-all duration-700 ease-out
                     group-hover:opacity-0 group-hover:-translate-x-6 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />

        {/* back */}
        <Image
          src={backSrc}
          alt={`${title} alt`}
          fill
          className="object-cover opacity-0 translate-x-6 scale-[1.02]
                     transition-all duration-700 ease-out
                     group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
      </div>

      <div className="absolute left-0 right-0 bottom-0 p-5">
        <div className="text-xs tracking-wide2 text-white/70">{meta}</div>
        <div className="mt-2 text-xl md:text-2xl">{title}</div>
      </div>
    </Link>
  );
}
