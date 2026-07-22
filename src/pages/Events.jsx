import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import HeroSlider from "../components/HeroSlider";
import ContactModal from "../components/ContactModal";
import { useEvents } from "../hooks/useSiteData";
import { imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Events() {
  const { t } = useTranslation();
  const { data: events = [], isLoading } = useEvents();
  const [active, setActive] = useState("tous");
  const [registerEvent, setRegisterEvent] = useState(null);
  const filtered = active === "tous" ? events : events.filter((e) => e.status === active);
  const sectionRef = useScrollReveal();

  const filters = [
    { key: "tous", label: t('events.all') },
    { key: "a_venir", label: t('events.upcoming') },
    { key: "passe", label: t('events.past') },
  ];

  return (
    <div className="font-body">
      <Navbar />

      
      <HeroSlider
        slides={(() => {
          const raw = t('events.hero.slides', { returnObjects: true });
          const heroSeeds = ["evenements-hero", "event-basketball", "event-conference", "event-formation", "event-gala"];
          return Array.isArray(raw) ? raw.map((s, i) => {
            const seed = heroSeeds[i % heroSeeds.length];
            return {
              image: imgHero(seed),
              imageBlur: imgBlur(seed),
              imageSrcSet: imgSrcSet(seed, [480, 768, 1024, 1280, 1600], 480, 'fill'),
              sizes: imgSizes('full'),
              alt: t('events.heroAlt'),
              ...s,
            };
          }) : [];
        })()}
        preloadSeed="evenements-hero"
        defaultBg={{ type: "gradient", value: "from-ink-900 via-ink to-ink-900" }}
        hideScrollIndicator
      />

      <section className="py-16 px-6" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-14 reveal">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-colors ${
                  active === f.key
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                  <div className="h-48 bg-gray-200 animate-shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="w-20 h-3 rounded bg-gray-200 animate-shimmer" />
                    <div className="w-full h-5 rounded bg-gray-200 animate-shimmer" />
                    <div className="w-3/4 h-4 rounded bg-gray-200 animate-shimmer" />
                    <div className="w-1/2 h-3 rounded bg-gray-200 animate-shimmer mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {filtered.length > 0 ? filtered.map((e) => (
                <div key={e.slug} className="reveal">
                  <EventCard event={e} onRegister={setRegisterEvent} />
                </div>
              )) : (
                <div className="col-span-full text-center py-16 text-gray-400">
                  <p className="text-gray-500 font-medium">{t('events.noEvents')}</p>
                  <p className="text-sm mt-1">{t('events.noEventsText')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ContactModal
        open={!!registerEvent}
        onClose={() => setRegisterEvent(null)}
        title={t('events.registerModalTitle')}
        description={registerEvent ? t('events.registerModalDescription', { title: registerEvent.title }) : ''}
        initialSubject={t('home.contact.formSubjectEventOption')}
        initialMessage={registerEvent ? t('events.registerModalMessage', { title: registerEvent.title, date: registerEvent.date }) : ''}
        successMessageKey="events.registerSuccessText"
        onSubmit={async (data) => {
          const firstName = data.firstname || data.name || "";
          const lastName = data.lastname || "";
          const email = data.email || "";
          const phone = data.phone || "";
          const message = data.message || "";
          const { error } = await supabase.from("registrations").insert({
            event_slug: registerEvent?.slug || null,
            event_title: registerEvent?.title || null,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            message,
          });
          if (error) {
            console.error("Events — Erreur d'inscription :", error);
            throw error;
          }
        }}
      />

      <Footer />
    </div>
  );
}
