export default function Footer() {
  return (
    <footer className="px-5 md:px-10 pb-10">
      <div className="max-w-6xl mx-auto border-t border-white/10 pt-8 text-sm text-white/60 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} PAULINE</div>
        <div className="flex gap-4">
          <a className="hover:text-white" href="#" aria-label="Instagram (placeholder)">Instagram</a>
          <a className="hover:text-white" href="#" aria-label="YouTube (placeholder)">YouTube</a>
          <a className="hover:text-white" href="#" aria-label="Email (placeholder)">Email</a>
        </div>
      </div>
    </footer>
  );
}
