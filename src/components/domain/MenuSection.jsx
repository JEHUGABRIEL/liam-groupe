import { UtensilsCrossed } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import SafeImg from "@/components/ui/SafeImg";
import { formatPrice } from "@/lib/format";

/** Identifiant d'ancre d'une rubrique (« Plats » → carte-plats). */
function anchor(category) {
  return `carte-${category.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

/**
 * Carte du restaurant : barre des rubriques qui reste visible sous l'en-tête,
 * puis une fiche par plat (photo, nom, description, prix, ajout au panier).
 */
export default function MenuSection({ menu = [] }) {
  return (
    <div>
      <nav aria-label="Rubriques de la carte" className="sticky top-[88px] z-20 -mx-5 border-y border-bordure bg-white/95 px-5 backdrop-blur sm:mx-0 sm:border-x">
        <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {menu.map((category) => (
            <li key={category.category}>
              <a href={`#${anchor(category.category)}`} className="t-label-sm flex h-14 items-center whitespace-nowrap px-4 text-encre/70 transition-colors hover:text-accent">
                {category.category}
                <span className="ml-2 font-normal text-encre/40">{category.items.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-16">
        {menu.map((category) => (
          <div key={category.category} id={anchor(category.category)} className="scroll-mt-[170px]">
            <div className="flex items-baseline justify-between border-b border-encre pb-4">
              <h3 className="t-h4">{category.category}</h3>
              <span className="t-label-sm text-encre/50">{category.items.length} au choix</span>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => (
                <li key={item.id} className="carte group flex flex-col border border-bordure bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gris-clair">
                    <SafeImg
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      fallback={(
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gris-clair text-brun/60">
                          <UtensilsCrossed aria-hidden="true" className="h-10 w-10" />
                          <span className="t-label-sm">O&apos;GAB</span>
                        </span>
                      )}
                    />
                    <span className="absolute bottom-0 right-0 bg-white px-3 py-2 font-mono text-[0.95rem] font-bold text-encre">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="t-h5">{item.name}</p>
                    {item.description && <p className="mt-2 text-[0.95rem] leading-relaxed text-encre/65">{item.description}</p>}
                    <div className="mt-auto pt-5">
                      <AddToCartButton source="MENU" item={item} className="btn-contour w-full" label="Ajouter au panier" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
