import { usePartners } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";


export default function PartnersCarousel() {
  const { data: partners = [] } = usePartners();
  const sectionRef = useScrollReveal();

  if (partners.length === 0) return null;

  return (
    <div className="relative" ref={sectionRef}>
      
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      
      <div className="overflow-hidden py-4">
        <div className="flex gap-16 items-center animate-scroll hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center justify-center h-24 w-40 grayscale hover:grayscale-0 transition-all duration-500"
            >
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading font-bold text-xl transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: p.color }}
                >
                  {p.initial}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
