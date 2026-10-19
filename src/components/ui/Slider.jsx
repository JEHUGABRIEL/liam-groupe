"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useRef, useState } from "react";

/**
 * Carrousel horizontal du modèle : défilement natif aimanté, pagination en tirets
 * (le tiret actif s'allonge) et flèches. `itemClassName` fixe la largeur des éléments.
 */
export default function Slider({ children, label, itemClassName = "w-[82%] sm:w-[calc(50%-14px)]", gap = 28 }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const items = Children.toArray(children);

  const goTo = (i) => {
    const node = track.current;
    const item = node?.children[i];
    if (item) node.scrollTo({ left: item.offsetLeft - node.offsetLeft, behavior: "smooth" });
  };
  const onScroll = () => {
    const node = track.current;
    const width = node.children[0]?.offsetWidth || 1;
    setIndex(Math.min(items.length - 1, Math.round(node.scrollLeft / (width + gap))));
  };

  return (
    <div className="min-w-0">
      <div ref={track} onScroll={onScroll} style={{ gap }} className="flex snap-x snap-mandatory overflow-x-auto pb-2 [scrollbar-width:none]">
        {items.map((item, i) => (
          <div key={item.key ?? i} className={`shrink-0 snap-start ${itemClassName}`}>{item}</div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2" role="tablist" aria-label={label}>
          {items.map((item, i) => (
            <button key={item.key ?? i} type="button" role="tab" aria-selected={i === index} aria-label={`${label} ${i + 1}`} onClick={() => goTo(i)}
              className={`h-1 transition-all ${i === index ? "w-8 bg-accent" : "w-3 bg-encre/25"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Précédent" onClick={() => goTo(Math.max(0, index - 1))} className="flex h-9 w-9 items-center justify-center border border-bordure bg-white hover:border-encre">
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Suivant" onClick={() => goTo(Math.min(items.length - 1, index + 1))} className="flex h-9 w-9 items-center justify-center border border-bordure bg-white hover:border-encre">
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
