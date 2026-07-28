"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Compass, MapPin, Phone, Mail, Clock, Send, Quote, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "../components/SectionHeading";
import HeroSlider from "../components/HeroSlider";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon, WhatsAppIcon } from "../components/SocialIcons";
import ContactForm from "../components/ContactForm";
import { useSiteInfo } from "../hooks/useSiteData";
import { img, imgHero, imgBlur, imgSrcSet, imgSizes, team as staticTeam } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";
import useUnsavedChanges from "../hooks/useUnsavedChanges";


const PRESIDENT_IMAGE = "/images/mot_presidente/presidente.png";

export default function About() {
  const { t } = useTranslation();
  const { data: siteInfo = {} } = useSiteInfo();
  const info = siteInfo?.contactPage ?? {};
  const missionRef = useScrollReveal();
  const presidentRef = useScrollReveal();
  const contactRef = useScrollReveal();
  const mapRef = useScrollReveal();
  const [contactDirty, setContactDirty] = useState(false);

  const founder = staticTeam.find((m) => m.name.includes("Marie-Claire")) || null;
  const { blocker } = useUnsavedChanges(contactDirty);
  const [missionImageIdx, setMissionImageIdx] = useState(0);
  const [missionPaused, setMissionPaused] = useState(false);

  
  useEffect(() => {
    if (missionPaused) return;
    const id = setInterval(() => {
      setMissionImageIdx((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(id);
  }, [missionPaused]);

  return (
    <div className="font-body">

      
      <HeroSlider
        slides={(() => {
          const raw = t('about.hero.slides', { returnObjects: true });
          const heroSeeds = ["apropos-hero", "apropos-1", "apropos-2"];
          return Array.isArray(raw) ? raw.map((s, i) => {
            const seed = heroSeeds[i % heroSeeds.length];
            return {
              image: imgHero(seed),
              imageBlur: imgBlur(seed),
              imageSrcSet: imgSrcSet(seed, [480, 768, 1024, 1280, 1600], 480, 'fill'),
              sizes: imgSizes('full'),
              alt: t('about.heroAlt'),
              ...s,
            };
          }) : [];
        })()}
        preloadSeed="apropos-hero"
        defaultBg={{ type: "gradient", value: "from-ink-900 via-ink to-ink-900" }}
        hideScrollIndicator
      />

      
      <section className="py-16 px-6" ref={missionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Target}
              eyebrow={t('about.mission.eyebrow')}
              title={t('about.mission.title')}
              align="left"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <p className="text-gray-500 leading-relaxed mb-5">
                {t('about.intro1')}
              </p>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 mb-3">
                {t('about.acronym.eyebrow')}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {(t('about.acronym.items', { returnObjects: true }) || []).map((item, i) => {
                  const tileColors = ["bg-coral-500", "bg-violet-500", "bg-green-500", "bg-brand-500"];
                  return (
                    <div key={item.letter} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
                      <span className={`w-8 h-8 shrink-0 rounded-full ${tileColors[i % 4]} text-white flex items-center justify-center font-heading font-bold text-sm`}>
                        {item.letter}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-sm text-ink">{item.word}</p>
                        <p className="text-gray-500 text-xs leading-snug mt-0.5">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6 stagger-children">
                <div className="flex gap-4 reveal">
                  <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold mb-1">{t('about.vision.title')}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {t('about.vision.text')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 reveal">
                  <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold mb-1">{t('about.missionBlock.title')}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {t('about.missionBlock.text')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="reveal relative overflow-hidden rounded-2xl h-[360px] md:h-[420px] group"
              onMouseEnter={() => setMissionPaused(true)}
              onMouseLeave={() => setMissionPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={missionImageIdx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={img(missionImageIdx === 0 ? "apropos-1" : "apropos-2", 600, 700)}
                    alt={missionImageIdx === 0 ? t('about.images.alt1') : t('about.images.alt2')}
                    width={600}
                    height={700}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </section>

      
      {founder && (
        <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50" ref={presidentRef}>
          <div className="max-w-6xl mx-auto">
            <div className="reveal text-center mb-14">
              <span className="text-brand-500 text-xs font-semibold tracking-[0.3em] uppercase">
                Mot de la fondatrice
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-ink mt-4">
                La vision de{" "}
                <span className="text-brand-500">Marie-Claire Ngbokoli</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              <div className="reveal order-2 lg:order-1">
                <div className="relative mx-auto max-w-md">
                  
                  <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl border-2 border-brand-500/20" />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-brand-500/5" />

                  
                  <div className="relative rounded-2xl overflow-hidden shadow-xl h-[440px] md:h-[520px]">
                    <img
                      src={PRESIDENT_IMAGE}
                      alt={founder.name}
                      width={600}
                      height={700}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <p className="text-white font-heading font-bold text-xl">
                        {founder.name}
                      </p>
                      <p className="text-white/80 text-sm font-medium">
                        {founder.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="reveal order-1 lg:order-2">
                <div className="relative">
                  
                  <Quote className="w-16 h-16 text-brand-500/10 absolute -top-4 -left-2" />

                  <div className="relative z-10 pl-6">
                    <p className="font-heading font-bold text-2xl md:text-3xl text-ink leading-tight mb-8">
                      « Révéler les talents, créer des opportunités durables. »
                    </p>

                    <div className="space-y-5 text-gray-600 leading-relaxed text-[15px]">
                      <p>
                        Quand j&apos;ai fondé <strong>LIAM Groupe</strong> en 2015, je portais une conviction
                        profonde : celle que les femmes et les jeunes de Centrafrique possèdent un potentiel
                        immense qui ne demande qu&apos;à être révélé. Chaque jour, à travers nos programmes —
                        du sport à l&apos;entrepreneuriat, de la gastronomie solidaire à la formation — nous
                        voyons des vies se transformer.
                      </p>
                      <p>
                        Nous sommes partis d&apos;un petit groupe de femmes déterminées à Bangui, et aujourd&apos;hui
                        nos initiatives touchent des milliers de bénéficiaires à travers le pays. Ce chemin
                        parcouru, nous le devons à la résilience et à la volonté inébranlable de chaque
                        personne qui croit en notre mission.
                      </p>
                      <p>
                        Chaque partenaire qui nous rejoint, chaque bénévole qui s&apos;engage, c&apos;est un projet
                        de plus qui voit le jour. C&apos;est une femme qui gagne en autonomie, un jeune qui
                        trouve sa voie, une communauté qui se renforce. Ensemble, bâtissons une Centrafrique
                        où chacun a les moyens de réaliser ses ambitions.
                      </p>
                    </div>

                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-brand-500/20 shrink-0">
                          <img
                            src={PRESIDENT_IMAGE}
                            alt={founder.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-heading font-bold text-ink">
                            {founder.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {founder.role} — LIAM Groupe
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      
      <section className="py-16 px-6 bg-gray-50" ref={contactRef}>
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
                      { Icon: WhatsAppIcon, href: siteInfo.social?.whatsapp ? `https://wa.me/${String(siteInfo.social.whatsapp).replace(/\D/g, "")}` : undefined },
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
                    <a
                      href={`https://wa.me/${String(siteInfo.social?.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(t("whatsapp.prefilledMessage"))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {t("whatsapp.cta")}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm page="about" onDirty={setContactDirty} formId="about" />

            
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

      
      <section className="px-6 pb-16" ref={mapRef}>
        <div className="max-w-6xl mx-auto reveal">
          <div className="rounded-2xl overflow-hidden border border-gray-100 h-[420px]">
            <iframe
              title="Localisation Bangui"
              className="w-full h-full"
              loading="lazy"
              decoding="async"
              src="https://www.openstreetmap.org/export/embed.html?bbox=18.50%2C4.30%2C18.65%2C4.42&layer=mapnik&marker=4.3614%2C18.5550"
            />
          </div>
        </div>
      </section>

    </div>
  );
}

function ContactItem({ icon: Icon, label, lines = [] }) {
  return (
    <div className="flex gap-4">
      <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
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
