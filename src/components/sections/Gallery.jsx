"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Galerie en mosaïque ; chaque photo s'ouvre en grand dans un nouvel onglet.
 * Une image introuvable est retirée de la mosaïque, sans laisser de case vide.
 */
export default function Gallery({ images = [], title = "En images" }) {
  const [broken, setBroken] = useState([]);
  const list = useRef(null);
  const visible = images.filter((src) => src && !broken.includes(src));

  // Images rendues côté serveur déjà en échec avant l'hydratation (onError manqué).
  useEffect(() => {
    const failed = [...(list.current?.querySelectorAll("img") || [])]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.getAttribute("src"));
    if (failed.length) setBroken((current) => [...current, ...failed]);
  }, []);
  if (visible.length === 0) return null;
  return (
    <section className="py-14 md:py-20">
      <div className="conteneur">
        <p className="t-label text-encre/60">{title}</p>
        <ul ref={list} className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((src, index) => (
            <li key={src} className={index % 5 === 0 ? "col-span-2 row-span-2" : ""}>
              <a href={src} target="_blank" rel="noopener noreferrer" className="group block h-full overflow-hidden bg-gris-clair">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  onError={() => setBroken((list) => [...list, src])}
                  className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
