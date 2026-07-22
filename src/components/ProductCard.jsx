import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ShoppingBag, ImageOff } from "lucide-react";
import SafeImg from "./SafeImg";
import { useCart } from "../lib/cartContext";

export default function ProductCard({ product, linkTo }) {
  const { t } = useTranslation();
  const { addItem: addToCart, openCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id: product.slug, name: product.name, price: product.price, image: product.image, source: "boutique" });
    openCart();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col hover:lift transition-all duration-300 group">        <div className="relative h-56 overflow-hidden bg-gray-50 group/image">
        <SafeImg
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          icon={ImageOff}
          eager
          retries={3}
        />
        
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 shadow-sm border border-gray-100">
          {product.category}
        </span>
        
        <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-brand-500 text-white text-sm font-bold shadow-lg">
          {product.price}
        </span>

        
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-brand-500 hover:bg-brand-500 hover:text-white hover:scale-110 transition-all duration-200 opacity-0 group-hover/image:opacity-100"
          aria-label="Ajouter au panier"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg text-ink leading-snug">{product.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mt-2 flex-1 line-clamp-3">
          {product.description}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100">
          {linkTo ? (
            <span className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-50 text-brand-700 font-semibold text-sm group/btn">
              <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              {t('common.discover', 'Voir le produit')}
            </span>
          ) : (
            <Link
              to="#contact"
              onClick={(e) => {
                e.preventDefault();
                const contact = document.getElementById('contact');
                if (contact) contact.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-sm transition-all hover:gap-3 group/btn no-underline"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              {t('home.products.order', 'Commander')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
