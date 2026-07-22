"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";
import HeroSlider from "../components/HeroSlider";
import { products as staticProducts } from "../data/siteData";
import { imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import { useLangPath } from "../lib/langPath";
import useScrollReveal from "../hooks/useScrollReveal";

export default function BoutiqueIndex() {
  const { t } = useTranslation();
  const p = useLangPath();
  const sectionRef = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [...new Set(staticProducts.map((p) => p.category))];
  const filtered = activeCategory
    ? staticProducts.filter((p) => p.category === activeCategory)
    : staticProducts;

  return (
    <div className="font-body">
      <Navbar />

      
      <HeroSlider
        slides={(() => {
          const raw = t('boutique.hero.slides', { returnObjects: true });
          const heroSeeds = ["boutique-hero", "produit-casquette", "produit-sac", "produit-tshirt"];
          return Array.isArray(raw) ? raw.map((s, i) => {
            const seed = heroSeeds[i % heroSeeds.length];
            return {
              image: imgHero(seed),
              imageBlur: imgBlur(seed),
              imageSrcSet: imgSrcSet(seed, [480, 768, 1024, 1280, 1600], 480, 'fill'),
              sizes: imgSizes('full'),
              ...s,
            };
          }) : [];
        })()}
        preloadSeed="boutique-hero"
        defaultBg={{ type: "gradient", value: "from-brand-800/60 via-ink/80 to-ink" }}
      />

      
      <section className="py-16 px-6" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={ShoppingBag}
              eyebrow={t('boutique.eyebrow')}
              variant="brand"
              title={t('boutique.title')}
              description={t('boutique.description')}
            />
          </div>

          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 reveal">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t('common.all', 'Tous')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {filtered.map((product) => (
                <div key={product.slug} className="reveal">
                  <Link
                    to={p(`/boutique/${product.slug}`)}
                    className="block no-underline"
                  >
                    <ProductCard product={product} linkTo={p(`/boutique/${product.slug}`)} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 reveal">
              <p className="text-gray-500 font-medium">{t('boutique.empty')}</p>
              <p className="text-sm mt-1">{t('boutique.emptyText')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
