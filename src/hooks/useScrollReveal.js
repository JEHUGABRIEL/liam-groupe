import { useEffect, useRef } from "react";


export default function useScrollReveal({
  animation = "animate-fade-up",
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  once = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          
          el.classList.add(animation);
          
          el.querySelectorAll(".reveal").forEach((child) => {
            child.classList.add(animation);
          });
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, threshold, rootMargin, once]);

  return ref;
}
