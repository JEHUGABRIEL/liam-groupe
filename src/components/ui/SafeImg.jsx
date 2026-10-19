"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Image venant du contenu (API) : si le fichier est introuvable, affiche `fallback`
 * s'il est fourni, sinon un fond neutre (ou rien du tout avec `hideOnError`).
 */
export default function SafeImg({ src, alt = "", className = "", hideOnError = false, fallback, ...props }) {
  const ref = useRef(null);
  const [broken, setBroken] = useState(!src);

  // Une image rendue côté serveur peut avoir échoué avant que React ne branche onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setBroken(true);
  }, [src]);

  if (broken) {
    if (fallback) return fallback;
    return hideOnError ? null : <span aria-hidden="true" className={`block bg-gris-clair ${className}`} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} className={className} onError={() => setBroken(true)} {...props} />;
}
