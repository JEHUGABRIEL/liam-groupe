import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang, langPath } from "../lib/langPath";
import { ArrowLeft, ShoppingBag, Tag, ImageOff, MessageSquare, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import SafeImg from "../components/SafeImg";
import { products as staticProducts } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";
import { useCart } from "../lib/cartContext";

export default function ProductDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const lang = useLang();
  const { addItem: addToCart, openCart } = useCart();
  const product = staticProducts.find((p) => p.slug === slug);
  const related = staticProducts
    .filter((p) => p.slug !== slug && p.category === product?.category)
    .slice(0, 3);
  const navigate = useNavigate();
  const contentRef = useScrollReveal();
  const relatedRef = useScrollReveal();

  if (staticProducts.length > 0 && !product) {
    return <Navigate to={langPath(lang, "/boutique")} replace />;
  }

  const scrollToContact = () => {
    navigate(langPath(lang, "/#contact"));
  };

  if (!product) {
    return null;
  }

  return (
    <div className="font-body">
      <Navbar transparentOnTop={false} />

      <div className="pt-[120px] pb-6 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to={langPath(lang, "/boutique")}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("boutique.back")}
          </Link>
        </div>
      </div>

      {product && (
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              
              <div className="reveal">
                <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square">
                  <SafeImg
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    icon={ImageOff}
                  />
                  
                  <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 shadow-sm">
                    {product.category}
                  </span>
                  
                  <span className="absolute bottom-5 right-5 px-5 py-2 rounded-full bg-brand-500 text-white text-lg font-bold shadow-lg">
                    {product.price}
                  </span>
                </div>
              </div>

              
              <div className="flex flex-col reveal" ref={contentRef}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-brand-500 mb-3">
                  <Tag className="w-3.5 h-3.5" />
                  {product.category}
                </span>
                <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight text-ink mb-4">
                  {product.name}
                </h1>

                <div className="text-3xl md:text-4xl font-bold text-brand-500 mb-6">
                  {product.price}
                </div>

                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {product.description}
                </p>

                
                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      addToCart({ id: product.slug, name: product.name, price: product.price, image: product.image, source: "boutique" });
                      openCart();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.97]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {t('boutique.order')}
                  </button>
                  <button
                    onClick={() => {
                      addToCart({ id: product.slug, name: product.name, price: product.price, image: product.image, source: "boutique" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 text-gray-700 hover:text-brand-600 font-semibold transition-all active:scale-[0.97]"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                  <a
                    href={`https://wa.me/23676000000?text=${encodeURIComponent(`Bonjour LIAM Groupe, je suis intéressé(e) par le produit "${product.name}" (${product.price}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-600 font-semibold transition-all active:scale-[0.97]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>

                
                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 font-medium uppercase tracking-wider text-xs mb-1">
                      {t('boutique.category')}
                    </p>
                    <p className="text-gray-700 font-semibold">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium uppercase tracking-wider text-xs mb-1">
                      {t('boutique.domain')}
                    </p>
                    <p className="text-gray-700 font-semibold">{product.domain === "g-fitness" ? "G-Fitness" : "LIAM Groupe"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      
      {related.length > 0 && (
        <section className="px-6 pb-16 bg-gray-50 pt-16" ref={relatedRef}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-10 reveal">
              {t("boutique.related")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {related.map((p) => (
                <div key={p.slug} className="reveal">
                  <Link
                    to={langPath(lang, `/boutique/${p.slug}`)}
                    className="block no-underline"
                  >
                    <ProductCard product={p} linkTo={langPath(lang, `/boutique/${p.slug}`)} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
