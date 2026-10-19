"use client";

import { useEffect, useRef } from "react";

/** Fait apparaître son contenu (fondu vers le haut) quand il entre à l'écran. */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("anime-vu");
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`anime ${className}`} style={{ "--delai": `${delay}ms` }} {...props}>
      {children}
    </Tag>
  );
}
