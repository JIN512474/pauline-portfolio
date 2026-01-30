export default function SectionIntro({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-3">
          <div className="text-xs tracking-wide2 text-white/60">{kicker}</div>
        </div>
        <div className="md:col-span-9">
          <h2 className="text-2xl md:text-4xl leading-tight whitespace-pre-line">
            {title}
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed max-w-2xl">{body}</p>
        </div>
      </div>
    </section>
  );
}
