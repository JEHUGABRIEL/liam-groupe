import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, ImageOff, Calendar, X, Mic, Trophy, ShoppingCart, Star, User, Quote, MessageSquare, UserPlus, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EventCard from "../../components/EventCard";
import GalleryLightbox from "../../components/GalleryLightbox";
import SafeImg from "../../components/SafeImg";
import HeroSlider from "../../components/HeroSlider";
import { useTestimonials } from "../../hooks/useSiteData";
import useScrollReveal from "../../hooks/useScrollReveal";
import { useCart } from "../../lib/cartContext";


export default function RestaurantDomain({ domain, events }) {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const storyRef = useScrollReveal();
  const menuRef = useScrollReveal();
  const galleryRef = useScrollReveal();
  const weekRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const { data: testimonials = [] } = useTestimonials();
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [testimonialItemsPerPage, setTestimonialItemsPerPage] = useState(3);
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const [storyImageIdx, setStoryImageIdx] = useState(0);
  const [storyPaused, setStoryPaused] = useState(false);
  const [galleryImageIdx, setGalleryImageIdx] = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const { addItem: addToCart, openCart } = useCart();

  
  useEffect(() => {
    const fn = () => {
      const w = window.innerWidth;
      if (w < 768) setTestimonialItemsPerPage(1);
      else if (w < 1024) setTestimonialItemsPerPage(2);
      else setTestimonialItemsPerPage(3);
    };
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const testimonialTotalPages = Math.max(1, Math.ceil(testimonials.length / testimonialItemsPerPage));
  const testimonialStart = testimonialPage * testimonialItemsPerPage;
  const testimonialVisible = testimonials.slice(testimonialStart, testimonialStart + testimonialItemsPerPage);

  const goTestimonial = (p) => setTestimonialPage(
    Math.max(0, Math.min(p, testimonialTotalPages - 1))
  );

  
  useEffect(() => {
    if (testimonialPaused || testimonials.length <= testimonialItemsPerPage) return;
    const id = setInterval(() => {
      setTestimonialPage((prev) => {
        const next = prev + 1;
        return next >= testimonialTotalPages ? 0 : next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [testimonialPaused, testimonials.length, testimonialItemsPerPage, testimonialTotalPages]);

  
  useEffect(() => {
    const images = domain.gallery.slice(0, 2);
    if (images.length <= 1 || storyPaused) return;
    const id = setInterval(() => {
      setStoryImageIdx((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [domain.gallery, storyPaused]);

  
  useEffect(() => {
    if (domain.gallery.length <= 1 || galleryPaused) return;
    const id = setInterval(() => {
      setGalleryImageIdx((prev) => (prev + 1) % domain.gallery.length);
    }, 4500);
    return () => clearInterval(id);
  }, [domain.gallery, galleryPaused]);

  const domainEvents = events.filter((e) => e.category?.toLowerCase() === domain.name?.toLowerCase());

  const SLIDE_TEXTS = [
    {
      eyebrow: "Restaurant Solidaire — Bangui",
      title: "O'GAB",
      description: "Une cuisine centrafricaine authentique et généreuse, ouverte midi et soir dans un cadre chaleureux.",
    },
    {
      eyebrow: "NOTRE CARTE",
      title: "Saveurs d'Afrique",
      description: "Découvrez nos plats préparés par des cheffes formées dans nos ateliers culinaires.",
    },
    {
      eyebrow: "FORMATION",
      title: "Ateliers culinaires",
      description: "Formation des femmes aux métiers de la gastronomie centrafricaine et à l'entrepreneuriat.",
    },
    {
      eyebrow: "TRAITEUR",
      title: "Événements sur mesure",
      description: "Service traiteur pour mariages, séminaires et réceptions. Une cuisine qui rassemble.",
    },
  ];

  const ogabSlides = useMemo(() => {
    const imgs = domain.gallery.length > 0 ? domain.gallery : [domain.heroImage];
    return imgs.map((img, i) => ({
      image: img,
      width: 1920,
      height: 700,
      ...SLIDE_TEXTS[i % SLIDE_TEXTS.length],
    }));
  }, [domain]);

  
  const handleRegister = (ev) => {
    const phone = (domain.restaurantInfo?.phone || "+236 76 03 03 03").replace(/\s/g, "").replace("+", "");
    const msg = encodeURIComponent(`Bonjour ! Je souhaite m'inscrire à l'événement : ${ev.title} (${ev.date}).`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  
  useEffect(() => {
    if (!selectedItem) return;
    const onKey = (e) => { if (e.key === "Escape") setSelectedItem(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  return (
    <div className="font-body bg-white">
      
      <AnimatePresence>
        {domain.restaurantInfo && bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-[60] bg-brand-500 text-white overflow-hidden"
          >
            <div className="relative overflow-hidden px-20">
              
              <div className="absolute right-0 inset-y-0 w-16 z-[1] pointer-events-none bg-gradient-to-l from-brand-500 to-transparent" />
              <motion.div
                className="flex gap-16 items-center whitespace-nowrap py-3 text-sm font-semibold"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                
                {[0, 1].map((key) => (
                  <div key={key} className="flex gap-16 items-center shrink-0">
                    {domain.restaurantInfo.address && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {domain.restaurantInfo.address}
                      </span>
                    )}
                    {domain.restaurantInfo.hours?.map((h, i) => (
                      <span key={i} className="inline-flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {h.days} · {h.time}
                      </span>
                    ))}
                    {domain.restaurantInfo.phone && (
                      <span className="inline-flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {domain.restaurantInfo.phone}
                      </span>
                    )}
                  </div>
                ))}
              </motion.div>
              <button
                type="button"
                onClick={() => setBannerVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Fermer le bandeau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      {bannerVisible && <div className="h-[44px] bg-brand-500" />}

      <Navbar topOffset={bannerVisible ? 44 : 0} />

      <HeroSlider
        slides={ogabSlides}
        heightClass="h-screen"
        defaultBg={{ type: "gradient", value: "from-ink/80 via-ink/60 to-ink/20" }}
      />

      
      <section className="py-16 px-6" ref={storyRef}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <span className="text-brand-500 text-xs font-semibold tracking-[0.3em] uppercase">Notre histoire</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-4 mb-6 leading-tight">
              Une cuisine centrafricaine qui donne du travail aux femmes de Bangui
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O&apos;GAB est né d&apos;une conviction simple : la gastronomie centrafricaine mérite une vitrine, et
              les femmes qui la font vivre méritent un vrai métier. Chaque plat servi ici est préparé par des
              cheffes formées dans nos ateliers culinaires.
            </p>
            <p className="text-gray-600 leading-relaxed">
              De la salle du restaurant aux services traiteur pour vos événements, nous cultivons une cuisine
              généreuse, locale, et accessible à tous les Banguissois.
            </p>
          </div>
          <div
            className="reveal relative overflow-hidden rounded-sm h-[280px] md:h-[360px] group"
            onMouseEnter={() => setStoryPaused(true)}
            onMouseLeave={() => setStoryPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={storyImageIdx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <SafeImg src={domain.gallery.slice(0, 2)[storyImageIdx]} alt={`O'GAB ${storyImageIdx + 1}`} className="w-full h-full object-cover" icon={ImageOff} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </section>

      
      {domain.menu && (
        <section className="py-16 px-6 bg-gray-50" ref={menuRef}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <span className="text-brand-500 text-xs font-semibold tracking-[0.3em] uppercase">La carte</span>
              <h2 className="font-heading font-bold text-4xl text-ink mt-4">Notre menu</h2>
              <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
                Cliquez sur un plat pour voir les détails et commander
              </p>
            </div>

            
            <div className="flex flex-wrap justify-center gap-3 mb-12 reveal">
              <button
                type="button"
                onClick={() => setMenuCategory(null)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  menuCategory === null
                    ? "bg-brand-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-brand-500/50 hover:text-brand-500"
                }`}
              >
                Tout voir
              </button>
              {domain.menu.map((section) => (
                <button
                  key={section.category}
                  type="button"
                  onClick={() => setMenuCategory(section.category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    menuCategory === section.category
                      ? "bg-brand-500 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-brand-500/50 hover:text-brand-500"
                  }`}
                >
                  {section.category}
                </button>
              ))}
            </div>

            
            <AnimatePresence mode="wait">
              {domain.menu
                .filter((section) => !menuCategory || section.category === menuCategory)
                .map((section) => (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mb-12 last:mb-0"
                  >

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {section.items.map((item) => {
                        const fullItem = { ...item, category: section.category }
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => setSelectedItem(fullItem)}
                            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left hover:shadow-xl hover:border-brand-200 hover:-translate-y-1.5 transition-all duration-300 ease-out"
                          >
                            
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                            {item.image && (
                              <div className="relative h-44 overflow-hidden bg-gray-100">
                                <SafeImg
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                
                                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[0.65rem] font-semibold text-brand-600 shadow-sm">
                                  {section.category}
                                </span>

                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({ id: item.name, name: item.name, price: item.price, image: item.image, source: "ogab" });
                                    openCart();
                                  }}
                                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-brand-500 hover:bg-brand-500 hover:text-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                  aria-label="Ajouter au panier"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            <div className="p-5">
                              
                              <div className="flex items-start justify-between gap-3 mb-2.5">
                                <h4 className="font-heading text-ink text-[0.95rem] font-bold leading-snug group-hover:text-brand-600 transition-colors flex-1">
                                  {item.name}
                                </h4>
                                <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-600 font-bold text-sm whitespace-nowrap shrink-0 group-hover:bg-brand-100 transition-colors">
                                  <span className="text-[0.6rem] font-normal text-brand-400">CFA</span>
                                  {item.price.replace(' FCFA', '')}
                                </span>
                              </div>

                              {item.description && (
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                                  {item.description}
                                </p>
                              )}

                              
                              <div className="flex items-center gap-2 pt-3 border-t border-gray-50 group-hover:border-brand-100 transition-colors">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({ id: item.name, name: item.name, price: item.price, image: item.image, source: "ogab" });
                                    openCart();
                                  }}
                                  className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-500 text-white hover:bg-brand-600 hover:scale-110 transition-all duration-200 shrink-0"
                                  aria-label="Ajouter au panier"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(fullItem);
                                  }}
                                  className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider hover:text-brand-500 transition-colors"
                                >
                                  Voir le détail
                                </button>
                                <svg className="w-3.5 h-3.5 ml-auto text-gray-300 group-hover:text-brand-400 transition-all group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-brand-500 text-xs font-semibold tracking-[0.3em] uppercase">Au-delà du restaurant</span>
            <h2 className="font-heading font-bold text-3xl text-ink mt-4">Nos autres actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {domain.programs
              .filter((p) => p.title !== "Restaurant solidaire" && p.title !== "Community Restaurant")
              .map((p, idx) => {
                const images = [
                  "/images/ogab/685703856_1462100469047417_2065620475939012998_n.jpg",
                  "/images/ogab/550532545_1283500053574127_3960370833048881420_n.jpg",
                ];
                const isFirst = idx === 0;
                const phone = (domain.restaurantInfo?.phone || "+236 76 03 03 03").replace(/\s/g, "").replace("+", "");
                return (
                  <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative h-52 overflow-hidden">
                      <SafeImg
                        src={images[idx % images.length]}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-7">
                      <h3 className="font-heading font-bold text-lg text-ink mb-2">{p.title}</h3>
                      <p className="text-gray-500 leading-relaxed text-sm mb-6">{p.description}</p>
                      {isFirst ? (
                        <button
                          type="button"
                          onClick={() => {
                            const msg = encodeURIComponent(`Bonjour ! Je souhaite en savoir plus sur vos services de ${p.title.toLowerCase()}.`);
                            window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Nous contacter
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const msg = encodeURIComponent(`Bonjour ! Je souhaite m'inscrire aux ateliers culinaires O'GAB.`);
                            window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-brand-500 text-brand-600 font-semibold hover:bg-brand-50 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          S'inscrire
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* CETTE SEMAINE — Événements */}
      <section className="py-16 px-6 bg-gray-50" ref={weekRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-brand-500 text-xs font-semibold tracking-[0.3em] uppercase">{t('domain.week.eyebrow')}</span>
            <h2 className="font-heading font-bold text-3xl text-ink mt-4">{t('domain.week.title', { domain: domain.name })}</h2>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-5 text-brand-500">
              <Calendar className="w-5 h-5" />
              <h3 className="font-heading font-bold text-lg text-ink">{t('events.title')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {domainEvents.slice(0, 3).map((e) => <EventCard key={e.slug} event={e} />)}
              {/* Cartes événements statiques O'GAB */}
              <EventCard
                event={{
                  slug: "karaoke-ogab",
                  title: "Soirée Karaoké",
                  description: "Venez chanter et partager un moment convivial autour d'un bon repas. Ambiance garantie !",
                  date: "Tous les vendredis",
                  location: "O'GAB — Bangui",
                  image: "/images/ogab/687170483_1462911208966343_5179896927689300392_n.jpg",
                  category: "O'GAB",
                  status: "a_venir",
                  icon: Mic,
                }}
                onRegister={handleRegister}
              />
              <EventCard
                event={{
                  slug: "coupe-du-monde-ogab",
                  title: "Coupe du Monde — Retransmission",
                  description: "Suivez les matchs de la Coupe du Monde sur grand écran chez O'GAB. Menu spécial et boissons aux couleurs des équipes.",
                  date: "Juin — Juillet 2026",
                  location: "O'GAB — Bangui",
                  image: "/images/ogab/514060818_1217276156863184_4307662795398036341_n.jpg",
                  category: "O'GAB",
                  status: "a_venir",
                  icon: Trophy,
                }}
                onRegister={handleRegister}
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6" ref={galleryRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="text-brand-500 text-xs font-semibold tracking-[0.3em] uppercase">Ambiance</span>
            <h2 className="font-heading font-bold text-3xl text-ink mt-4">Galerie</h2>
          </div>
          {domain.gallery.length > 0 && (
            <div
              className="relative overflow-hidden rounded-2xl h-[420px] md:h-[520px] group"
              onMouseEnter={() => setGalleryPaused(true)}
              onMouseLeave={() => setGalleryPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={galleryImageIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setLightboxIndex(galleryImageIdx)}
                >
                  <SafeImg
                    src={domain.gallery[galleryImageIdx]}
                    alt={`${domain.name} ${galleryImageIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-2 bg-white/90 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                        <ImageIcon className="w-4 h-4" />
                        Agrandir
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          )}
          {domain.gallery.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-gray-500 font-medium">Aucune image pour le moment</p>
              <p className="text-sm mt-1">Les photos seront bientôt disponibles</p>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <GalleryLightbox images={domain.gallery} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white border border-gray-100 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
            >
              
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 flex items-center justify-center text-white transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                
                {selectedItem.image && (
                  <div className="relative h-56 overflow-hidden">
                    <SafeImg
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    
                    <div className="absolute bottom-4 left-6 right-6 z-10">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[0.6rem] font-semibold tracking-[0.2em] uppercase mb-2">
                        {selectedItem.category}
                      </span>
                      <h3 className="font-heading font-bold text-2xl text-white leading-tight">
                        {selectedItem.name}
                      </h3>
                    </div>
                  </div>
                )}

                {!selectedItem.image && (
                  <div className="pt-10 px-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-[0.6rem] font-semibold tracking-[0.2em] uppercase mb-3">
                      {selectedItem.category}
                    </span>
                    <h3 className="font-heading font-bold text-2xl text-ink leading-tight mb-6">
                      {selectedItem.name}
                    </h3>
                  </div>
                )}

                <div className="px-8 pb-8">
                  
                  <div className={`flex items-center justify-between py-4 px-5 rounded-xl bg-brand-50/60 border border-brand-100 mb-6 ${selectedItem.image ? '-mt-4 relative z-10' : ''}`}>
                    <span className="text-gray-600 text-sm font-medium">Prix</span>
                    <span className="font-heading text-brand-600 text-xl font-bold">{selectedItem.price}</span>
                  </div>

                  {selectedItem.description && (
                    <div className="mb-8">
                      <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">Description</h4>
                      <p className="text-gray-600 leading-relaxed text-[0.95rem]">
                        {selectedItem.description}
                      </p>
                    </div>
                  )}

                  
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const phone = (domain.restaurantInfo?.phone || "+236 76 03 03 03").replace(/\s/g, "").replace("+", "")
                        const message = encodeURIComponent(
                          `Bonjour ! Je souhaite commander : ${selectedItem.name} (${selectedItem.price})`
                        )
                        window.open(`https://wa.me/${phone}?text=${message}`, "_blank")
                      }}
                      className="w-full inline-flex items-center justify-center gap-2.5 bg-brand-500 text-white font-semibold px-6 py-4 rounded-xl hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 transition-all active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Commander sur WhatsApp
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-500 font-medium px-6 py-3.5 rounded-xl hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50/50 transition-all"
                    >
                      Continuer ma sélection
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {testimonials.length > 0 && (
        <section
          className="py-16 px-6 bg-gray-50 overflow-hidden"
          ref={testimonialsRef}
          onMouseEnter={() => setTestimonialPaused(true)}
          onMouseLeave={() => setTestimonialPaused(false)}
        >
          <div className="max-w-6xl mx-auto mb-12">
            <div className="text-center reveal">
              <span className="text-brand-500 text-xs font-semibold tracking-[0.3em] uppercase">Ils nous recommandent</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-4">Ce que disent nos clients</h2>
              <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
                Des partenaires et bénéficiaires qui témoignent de l&apos;impact de nos actions
              </p>
            </div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            
            <div className="absolute left-0 inset-y-0 w-16 md:w-28 z-[1] pointer-events-none bg-gradient-to-r from-gray-50 to-transparent" />
            <div className="absolute right-0 inset-y-0 w-16 md:w-28 z-[1] pointer-events-none bg-gradient-to-l from-gray-50 to-transparent" />

            
            {testimonialTotalPages > 1 && (
              <button
                type="button"
                onClick={() => goTestimonial(testimonialPage - 1)}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-brand-500 hover:border-brand-500/50 transition-all"
                aria-label="Groupe d'avis précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            
            {testimonialTotalPages > 1 && (
              <button
                type="button"
                onClick={() => goTestimonial(testimonialPage + 1)}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-brand-500 hover:border-brand-500/50 transition-all"
                aria-label="Groupe d'avis suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            
            <div className="overflow-hidden px-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialPage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {testimonialVisible.map((t) => (
                    <div
                      key={t.name}
                      className="bg-white border border-gray-200 rounded-xl p-7 hover:border-brand-500/30 hover:shadow-md transition-all duration-300"
                    >
                      
                      <div className="flex gap-1 text-amber-400 mb-5">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star key={starIdx} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      
                      <div className="relative">
                        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-brand-500/10" />
                        <p className="text-gray-600 italic leading-relaxed text-sm pl-5 line-clamp-4">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>

                      
                      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                        {t.image ? (
                          <SafeImg
                            src={t.image}
                            alt={t.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                            icon={User}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-500 flex items-center justify-center font-bold text-sm shrink-0">
                            {t.name?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-ink truncate">{t.name}</p>
                          {t.role && (
                            <p className="text-gray-500 text-xs truncate">{t.role}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            
            {testimonialTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-10">
                {Array.from({ length: testimonialTotalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTestimonialPage(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === testimonialPage
                        ? "bg-brand-500 w-7"
                        : "bg-gray-300 hover:bg-gray-400 w-2.5"
                    }`}
                    aria-label={`Aller au groupe ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      
      <section className="py-20 px-6 bg-brand-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Réservez ou commandez chez O&apos;GAB
          </h2>
          <p className="text-white/80 mb-8">
            Ouvert midi et soir à Bangui — venez découvrir une cuisine centrafricaine authentique, ou commandez depuis chez vous.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {domain.restaurantInfo?.phone && (
              <>
                <a
                  href={`tel:${domain.restaurantInfo.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all"
                >
                  <Phone className="w-4 h-4" /> Réserver une table
                </a>
                <a
                  href={`https://wa.me/${domain.restaurantInfo.phone.replace(/\s/g, "").replace("+", "")}?text=${encodeURIComponent("Bonjour ! Je souhaite commander chez O'GAB.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" /> Commander sur WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer hideCTA />
    </div>
  );
}
