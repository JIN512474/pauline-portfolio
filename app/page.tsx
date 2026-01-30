import Hero from "@/components/hero";
import HomeProfileSnippet from "@/components/home-profile-snippet";
import HomePortfolioGrid from "@/components/home-portfolio-grid";

export default function Home() {
  return (
    <div>
      <Hero />

      <div className="px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <HomeProfileSnippet />
          <HomePortfolioGrid />
        </div>
      </div>
    </div>
  );
}
