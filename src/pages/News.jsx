import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import HeroSlider from "../components/HeroSlider";
import { useNews } from "../hooks/useSiteData";
import { imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function News_() {
  const { t } = useTranslation();
  const { data: news = [], isLoading } = useNews();
  const sectionRef = useScrollReveal();

  return (
    <div className="font-body">
      <Navbar />

      
      <HeroSlider
        slides={(() => {
          const raw = t('news.hero.slides', { returnObjects: true });
          const heroSeeds = ["actualites-hero", "news-prix", "news-minusca", "news-ogab", "news-formation", "news-basketball", "news-portrait"];
          return Array.isArray(raw) ? raw.map((s, i) => {
            const seed = heroSeeds[i % heroSeeds.length];
            return {
              image: imgHero(seed),
              imageBlur: imgBlur(seed),
              imageSrcSet: imgSrcSet(seed, [480, 768, 1024, 1280, 1600], 480, 'fill'),
              sizes: imgSizes('full'),
              alt: t('news.heroAlt'),
              ...s,
            };
          }) : [];
        })()}
        preloadSeed="actualites-hero"
        defaultBg={{ type: "gradient", value: "from-ink-900 via-ink to-ink-900" }}
        hideScrollIndicator
      />

      <section className="py-16 px-6" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                  <div className="h-48 bg-gray-200 animate-shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="w-20 h-3 rounded bg-gray-200 animate-shimmer" />
                    <div className="w-full h-5 rounded bg-gray-200 animate-shimmer" />
                    <div className="w-3/4 h-4 rounded bg-gray-200 animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>{news.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
                {news.map((n) => (
                  <div key={n.slug} className="reveal">
                    <NewsCard item={n} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-gray-500 font-medium">{t('news.noNews')}</p>
                <p className="text-sm mt-1">{t('news.noNewsText')}</p>
              </div>
            )}</>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
