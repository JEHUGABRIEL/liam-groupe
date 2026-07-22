import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  HeartHandshake,
  MessageSquare,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../lib/langPath";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import DomainCard from "../components/DomainCard";
import EventCard from "../components/EventCard";
import NewsCard from "../components/NewsCard";
import TestimonialCarousel from "../components/TestimonialCarousel";
import PartnersCarousel from "../components/PartnersCarousel";
import StatsSection from "../components/StatsSection";
import FAQSection from "../components/FAQSection";
import { JoinCTA } from "../components/CTASection";
import HeroSlider from "../components/HeroSlider";
import { imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import ContactForm from "../components/ContactForm";
import ProductCard from "../components/ProductCard";
import SafeImg from "../components/SafeImg";
import { domains as staticDomains, products as staticProducts } from "../data/siteData";
import { useDomains, useEvents, useNews, useSiteInfo, useHomeHeroImages } from "../hooks/useSiteData";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "../components/SocialIcons";
import useScrollReveal from "../hooks/useScrollReveal";
import useUnsavedChanges from "../hooks/useUnsavedChanges";

export default function Home() {
  const { t } = useTranslation();
  const p = useLangPath();
  const { data: domains = [] } = useDomains();
  const { data: events = [] } = useEvents();
  const { data: news = [] } = useNews();
  const { data: siteInfo = {} } = useSiteInfo();
  const info = siteInfo?.contactPage ?? {};
  const upcomingAndRecent = events.slice(0, 3);
  const domainsRef = useScrollReveal();
  const eventsRef = useScrollReveal();
  const newsRef = useScrollReveal({ animation: "animate-reveal-strong", rootMargin: "0px 0px -60px 0px" });
  const productsRef = useScrollReveal();
  const partnersRef = useScrollReveal();
  const testimonialRef = useScrollReveal();
  const contactRef = useScrollReveal();
  const featuredRef = useScrollReveal();

  
  const [contactDirty, setContactDirty] = useState(false);
  const { blocker } = useUnsavedChanges(contactDirty);
  const { data: homeHeroImages = [] } = useHomeHeroImages();

  
  const featured = useMemo(() => {
    const slugs = ["ogab", "g-fitness", "miss-centrafrique"];
    return slugs
      .map((slug) => staticDomains.find((d) => d.slug === slug))
      .filter(Boolean);
  }, []);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);

  
  useEffect(() => {
    if (featured.length <= 1 || featuredPaused) return;
    const id = setInterval(() => {
      setFeaturedIdx((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(id);
  }, [featured.length, featuredPaused]);

  const fd = featured[featuredIdx];

  return (
    <div className="font-body">
      <Navbar />

      
      <HeroSlider
        slides={(() => {
          const raw = t('hero.slides', { returnObjects: true });
          
          const heroSeeds = [
            "home-hero",
            "gfitness-hero",
            "ogab-hero",
            "formation-hero",
            "partenaires-hero",
            "entreprenariat-hero",
            "communication-hero",
            "evenementiel-hero",
            "apropos-hero",
          ];
          return Array.isArray(raw) ? raw.map((s, i) => {
            const seed = heroSeeds[i % heroSeeds.length];
            const adminImage = homeHeroImages.length > 0 ? homeHeroImages[i % homeHeroImages.length] : null;
            return {
              image: adminImage || imgHero(seed),
              imageBlur: imgBlur(seed),
              imageSrcSet: imgSrcSet(seed, [480, 768, 1024, 1280, 1600], 900, 'fill'),
              sizes: imgSizes('full'),
              width: 1920,
              height: 1080,
              cta: (
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to={p("/domaines")}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                  >
                    {t('home.domains.eyebrow', 'Nos domaines')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={p("/evenements")}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 font-semibold transition-colors backdrop-blur-sm"
                  >
                    {t('hero.ctaEvents')}
                  </Link>
                </div>
              ),
              ...s,
            };
          }) : [];
        })()}
        heightClass="h-screen"
        preloadSeed="home-hero"
        defaultBg={{ type: "gradient", value: "from-brand-800/60 via-ink/80 to-ink" }}
      />

      
      <StatsSection />

      
      <section className="py-16 px-6 bg-gray-50" ref={featuredRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-brand-500 italic font-medium mb-2">
              {t('home.featured.eyebrow', 'Nos domaines phares')}
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink">
              {t('home.featured.title', 'Découvrez nos projets emblématiques')}
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              {t('home.featured.description', 'Des initiatives qui transforment la Centrafrique, du sport à la gastronomie en passant par la culture.')}
            </p>
          </div>

          <div
            className="relative h-[440px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl reveal group bg-ink"
            onMouseEnter={() => setFeaturedPaused(true)}
            onMouseLeave={() => setFeaturedPaused(false)}
          >
            <AnimatePresence>
              {fd && (
                <motion.div
                  key={featuredIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  
                  <SafeImg
                    src={fd.heroImage}
                    alt={t(`domains.data.${fd.slug}.name`, fd.name)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    eager
                    retries={3}
                  />

                  
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10" />

                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                    <p className="text-brand-400 text-xs font-bold tracking-[0.25em] uppercase">
                      {t(`domains.data.${fd.slug}.category`, fd.category)}
                    </p>
                    <h3 className="text-white font-heading font-bold text-3xl md:text-4xl lg:text-5xl mt-2 leading-tight">
                      {t(`domains.data.${fd.slug}.name`, fd.name)}
                    </h3>
                    <p className="text-white/70 mt-4 max-w-xl leading-relaxed line-clamp-2">
                      {t(`domains.data.${fd.slug}.shortDescription`, fd.shortDescription)}
                    </p>
                    <Link
                      to={p(`/domaines/${fd.slug}`)}
                      className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 bg-white text-ink font-semibold rounded-full hover:bg-white/90 transition-all"
                    >
                      {t('common.discover', 'Découvrir')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6" ref={domainsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={LayoutGrid}
              eyebrow={t('home.domains.eyebrow')}
              variant="brand"
              title={t('home.domains.title')}
              description={t('home.domains.description')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {domains.filter((d) => d.slug !== "communication").map((d) => (
              <div key={d.slug} className="reveal">
                <DomainCard domain={d} />
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50/50" ref={productsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={ShoppingBag}
              eyebrow={t('home.products.eyebrow')}
              variant="brand"
              title={t('home.products.title')}
              description={t('home.products.description')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {staticProducts.slice(0, 6).map((product) => (
              <div key={product.slug} className="reveal">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link
              to={p("/boutique")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white font-semibold transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('home.products.viewAll', 'Voir tous les produits')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6 bg-gray-50" ref={eventsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal">
            <div>
              <p className="text-brand-500 italic font-medium mb-2">
                {t('home.events.eyebrow')}
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">{t('home.events.title')}</h2>
            </div>
            <Link
              to={p("/evenements")}
              className="text-brand-600 font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              {t('home.events.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
            {upcomingAndRecent.map((e) => (
              <div key={e.slug} className="reveal">
                <EventCard event={e} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6" ref={newsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal">
            <div>
              <p className="text-brand-500 italic font-medium mb-2">
                {t('home.news.eyebrow')}
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">{t('home.news.title')}</h2>
            </div>
            <Link
              to={p("/actualites")}
              className="text-brand-600 font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              {t('home.news.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {news.slice(0, 3).map((n) => (
                <div key={n.slug} className="reveal">
                  <NewsCard item={n} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 reveal">
              <p className="text-gray-500 font-medium">{t('news.noNews')}</p>
              <p className="text-sm mt-1">{t('news.noNewsText')}</p>
            </div>
          )}
        </div>
      </section>

      
      <section className="py-16 px-6 overflow-hidden" ref={partnersRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={HeartHandshake}
              eyebrow={t('home.partners.eyebrow')}
              title={t('home.partners.title')}
              description={t('home.partners.description')}
            />
          </div>

          <div className="reveal">
            <PartnersCarousel />
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6 bg-gray-50" ref={testimonialRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={MessageSquare}
              eyebrow={t('home.testimonials.eyebrow')}
              variant="blue"
              title={t('home.testimonials.title')}
              description={t('home.testimonials.description')}
            />
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      <JoinCTA />

      
      <FAQSection />

      
      <section className="py-16 px-6 bg-gray-50" id="contact" ref={contactRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <SectionHeading icon={MapPin} eyebrow={t('contact.eyebrow')} title={t('contact.title')} align="left" />
          </div>
          <div className="grid grid-cols-1 gap-12">
            <div className="reveal">
              <p className="text-gray-500 leading-relaxed mb-8 -mt-4">
                {t('contact.intro')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-children">
                <div className="space-y-6">
                  <div className="reveal"><ContactItem icon={MapPin} label={t('contact.address')} lines={info.address} /></div>
                  <div className="reveal"><ContactItem icon={Clock} label={t('contact.hours')} lines={info.hours} /></div>
                </div>
                <div className="space-y-6">
                  <div className="reveal"><ContactItem icon={Phone} label={t('contact.phone')} lines={info.phones} /></div>
                  <div className="reveal"><ContactItem icon={Mail} label={t('contact.email')} lines={info.emails} /></div>
                </div>
                <div className="reveal bg-brand-50/60 rounded-2xl p-7">
                  <h3 className="font-heading font-bold mb-1">{t('contact.socialTitle')}</h3>
                  <p className="text-gray-500 mb-5">{t('contact.socialText')}</p>
                  <div className="flex items-center gap-3">
                    {[
                      { Icon: FacebookIcon, href: siteInfo.social?.facebook },
                      { Icon: InstagramIcon, href: siteInfo.social?.instagram },
                      { Icon: XIcon, href: siteInfo.social?.x },
                      { Icon: YoutubeIcon, href: siteInfo.social?.youtube },
                    ].map(({ Icon, href }, i) => (
                      <a
                        key={i}
                        href={href || '#'}
                        target={href ? '_blank' : undefined}
                        rel={href ? 'noopener noreferrer' : undefined}
                        aria-label="social"
                        className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ContactForm page="home" onDirty={setContactDirty} formId="home" />

            
            {blocker.state === "blocked" && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="fixed inset-0 bg-black/50" onClick={() => blocker.reset()} />
                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <Send className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {t('contact.blockerTitle')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('contact.blockerText')}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => blocker.reset()}
                      className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      {t('contact.blockerStay')}
                    </button>
                    <button
                      onClick={() => blocker.proceed()}
                      className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                    >
                      {t('contact.blockerLeave')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactItem({ icon: Icon, label, lines = [] }) {
  return (
    <div className="flex gap-4">
      <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="font-heading font-bold">{label}</p>
        {(lines ?? []).map((l) => (
          <p key={l} className="text-gray-500">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}


