import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Globe, X, ArrowUpRight, Home, Info, LayoutGrid, Calendar, Newspaper, Phone, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useNavLinks, useDomains, useEvents } from "../hooks/useSiteData";
import { prefetchRoute } from "../lib/routePrefetch";
import { langPath } from "../lib/langPath";
import { DomainIcon } from "./DomainIcon";
import ContactModal from "./ContactModal";
import { useCart } from "../lib/cartContext";


export default function Navbar({ transparentOnTop = true, topOffset = 0 }) {
  const [scrolled, setScrolled] = useState(() =>
    transparentOnTop ? typeof window !== "undefined" && window.scrollY > 40 : true
  );
  const [shrunk, setShrunk] = useState(() =>
    typeof window !== "undefined" && window.scrollY > 200
  );
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();
  const { data: events = [] } = useEvents();
  const closeTimer = useRef(null);
  const langTimer = useRef(null);
  const { lang } = useParams();
  const navigate = useNavigate();
  const [prevPath, setPrevPath] = useState(location.pathname);
  const { t, i18n } = useTranslation();
  const { data: navLinks = [] } = useNavLinks();
  const { data: domains = [] } = useDomains();

  
  const isEnglish = i18n.language?.startsWith("en");
  const allNavLinks = (() => {
    const hasBoutique = navLinks.some((l) => l.to === '/boutique')
    if (!hasBoutique) {
      const boutiqueLink = { label: isEnglish ? 'Shop' : 'Boutique', to: '/boutique' }
      
      if (navLinks.length >= 3) {
        return [...navLinks.slice(0, 3), boutiqueLink, ...navLinks.slice(3)]
      }
      return [...navLinks, boutiqueLink]
    }
    return navLinks
  })()
  const currentLang = isEnglish ? "EN" : "FR";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (transparentOnTop) setScrolled(y > 40);
      setShrunk(y > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (mobileOpen) setMobileOpen(false);
    if (domainsOpen) setDomainsOpen(false);
  }

  
  const [badgeDismissed, setBadgeDismissed] = useState(() => {
    try {
      return localStorage.getItem("liam-badge-dismissed") === "true";
    } catch {
      return false;
    }
  });
  const hasUpcomingEvents = events.some((e) => e.status === "a_venir");
  const badgeVisible = hasUpcomingEvents && !badgeDismissed && !mobileOpen;

  
  useEffect(() => {
    if (
      location.pathname.includes("evenement") ||
      location.pathname.includes("actualite")
    ) {
      dismissBadge();
    }
  }, [location.pathname]);

  const dismissBadge = () => {
    try {
      localStorage.setItem("liam-badge-dismissed", "true");
    } catch {}
    setBadgeDismissed(true);
  };

  const isTransparent = transparentOnTop && !scrolled && !mobileOpen;

  const openDomains = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDomainsOpen(true);
  };
  const scheduleCloseDomains = () => {
    closeTimer.current = setTimeout(() => setDomainsOpen(false), 150);
  };

  
  const dropdownVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: 4,
      scale: 0.97,
      transition: { duration: 0.12, ease: "easeIn" },
    },
  };

  const langDropdownVariants = {
    hidden: { opacity: 0, y: 6, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: 3,
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeIn" },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <>
      <header
        style={{ top: topOffset }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_40px_rgba(0,0,0,0.08)] before:absolute before:inset-x-0 before:bottom-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-gray-200/60 before:to-transparent"
        }`}
      >
        <nav
          className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-500 ease-out max-lg:h-20 ${
            shrunk ? "lg:h-[60px]" : scrolled ? "lg:h-[72px]" : "lg:h-[88px]"
          }`}
        >
          
          <Link
            to={langPath(lang || "fr", "/")}
            className="flex items-center gap-2 shrink-0 no-underline group"
          >
            <span
              className={`font-heading font-bold leading-none tracking-tight transition-all duration-500 ease-out max-lg:text-2xl ${
                shrunk
                  ? "lg:text-xl xl:text-2xl"
                  : scrolled
                  ? "lg:text-2xl xl:text-3xl"
                  : "lg:text-3xl xl:text-4xl"
              } ${isTransparent ? "text-white" : "text-ink"}`}
            >
              LIAM
              <span className="text-brand-500 transition-transform duration-300 group-hover:scale-110 inline-block origin-center">
                .
              </span>
            </span>
          </Link>

          
          <div
            className={`hidden lg:flex items-center transition-all duration-500 ease-out ${
              shrunk ? "gap-5" : scrolled ? "gap-7" : "gap-8"
            }`}
          >
            {allNavLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={openDomains}
                  onMouseLeave={scheduleCloseDomains}
                >
                  <button
                    className={`flex items-center gap-1.5 font-medium tracking-wide transition-all duration-200 ${
                      shrunk ? "text-[13px]" : "text-sm"
                    } ${isTransparent ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-ink"}`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`transition-all duration-300 ${
                        shrunk ? "w-3 h-3" : "w-3.5 h-3.5"
                      } ${domainsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {domainsOpen && (
                      <motion.div
                        key="domain-dropdown"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[580px]"
                      >
                        
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />
                        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.2)] border border-gray-100/80 p-3 grid grid-cols-2 gap-1 overflow-hidden">
                          {domains.map((d) => (
                            <Link
                              key={d.slug}
                              to={langPath(lang || "fr", `/domaines/${d.slug}`)}
                              onMouseEnter={() => prefetchRoute(`/domaines/${d.slug}`)}
                              className="flex items-start gap-3 px-3.5 py-3.5 rounded-xl text-gray-600 hover:bg-brand-50/70 hover:text-brand-600 transition-all duration-200 group/card"
                            >
                              <span className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 group-hover/card:bg-white flex items-center justify-center transition-colors duration-200">
                                <DomainIcon
                                  icon={d.icon}
                                  className="w-5 h-5 text-gray-500 group-hover/card:text-brand-500 transition-colors duration-200"
                                />
                              </span>
                              <span className="min-w-0">
                                <span className="block font-semibold text-sm leading-tight">
                                  {t(`domains.data.${d.slug}.name`, d.name)}
                                </span>
                                <span className="block text-[11px] font-medium text-gray-400 tracking-wider mt-0.5 uppercase">
                                  {t(`domains.data.${d.slug}.category`, d.category)}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={langPath(lang || "fr", link.to)}
                  end={link.to === "/"}
                  onMouseEnter={() => prefetchRoute(link.to)}
                  className={({ isActive }) =>
                    `relative font-medium tracking-wide transition-all duration-200 group ${
                      shrunk ? "text-[13px]" : "text-sm"
                    } ${isTransparent ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-ink"}`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative inline-block py-1">
                      {link.label}
                      <span
                        className={`absolute -bottom-1 left-0 rounded-full transition-all duration-300 ease-out ${
                          shrunk ? "h-[2px]" : "h-[2.5px]"
                        } ${isActive ? "w-full bg-brand-500" : "w-0 group-hover:w-full bg-brand-400/60"}`}
                      />
                    </span>
                  )}
                </NavLink>
              )
            )}
          </div>

          
          <div className="hidden lg:flex items-center gap-5">
            
            <CartNavButton />

            
            <div
              className="relative"
              onMouseEnter={() => {
                if (langTimer.current) clearTimeout(langTimer.current);
                setLangOpen(true);
              }}
              onMouseLeave={() => {
                langTimer.current = setTimeout(() => setLangOpen(false), 150);
              }}
            >
              <button
                className={`flex items-center gap-1.5 font-medium transition-all duration-200 ${
                  shrunk ? "text-xs" : "text-sm"
                } ${isTransparent ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-ink"}`}
                onClick={() => setLangOpen((o) => !o)}
              >
                <Globe
                  className={`transition-all duration-200 ${
                    shrunk ? "w-3 h-3" : "w-3.5 h-3.5"
                  }`}
                />
                <span>{currentLang}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    key="lang-dropdown"
                    variants={langDropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full right-0 mt-3 w-28"
                  >
                    <div className="bg-white rounded-xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] border border-gray-100/80 py-1.5 overflow-hidden">
                      <button
                        onClick={() => {
                          i18n.changeLanguage("fr");
                          navigate(
                            langPath(
                              "fr",
                              location.pathname.replace(/^\/[a-z]{2}/, "") || "/"
                            )
                          );
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
                          currentLang === "FR"
                            ? "text-brand-600 font-semibold bg-brand-50/80"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {t("nav.langFr")}
                      </button>
                      <button
                        onClick={() => {
                          i18n.changeLanguage("en");
                          navigate(
                            langPath(
                              "en",
                              location.pathname.replace(/^\/[a-z]{2}/, "") || "/"
                            )
                          );
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
                          currentLang === "EN"
                            ? "text-brand-600 font-semibold bg-brand-50/80"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {t("nav.langEn")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            
            <button
              onClick={() => setContactOpen(true)}
              className={`group relative inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out overflow-hidden ${
                shrunk
                  ? "pl-3.5 pr-3 py-1.5 text-xs"
                  : scrolled
                  ? "pl-4 pr-3.5 py-2 text-sm"
                  : "pl-5 pr-4 py-2.5 text-sm"
              } ${isTransparent ? "bg-white/95 text-ink hover:bg-white hover:shadow-lg hover:shadow-black/5" : "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20"}`}
            >
              
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative z-10">{t("nav.cta")}</span>
              <ArrowUpRight
                className={`relative z-10 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  shrunk ? "w-3 h-3" : "w-4 h-4"
                }`}
              />
            </button>
          </div>

          
          
          <MobileCartButton />

          <button
            className={`lg:hidden relative z-50 w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
              isTransparent
                ? "hover:bg-white/10"
                : "hover:bg-black/5"
            } ${mobileOpen ? (isTransparent ? "bg-white/10" : "bg-black/5") : ""}`}
            onClick={() => {
              if (badgeVisible) dismissBadge();
              setMobileOpen((o) => !o);
            }}
            aria-label={mobileOpen ? t("common.close") : t("nav.menu")}
          >
            
            {badgeVisible && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 z-10">
                <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-brand-500" />
              </span>
            )}
            <div className={`relative w-5 h-5 transition-all duration-300 ${mobileOpen ? "scale-90" : ""}`}>
              <span
                className={`absolute left-0 h-[2.5px] w-full rounded-full transition-all duration-300 ${
                  isTransparent ? "bg-white" : "bg-ink"
                } ${mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2.5px] w-full rounded-full transition-all duration-300 ${
                  isTransparent ? "bg-white" : "bg-ink"
                } ${mobileOpen ? "opacity-0 scale-0" : ""}`}
              />
              <span
                className={`absolute left-0 h-[2.5px] w-full rounded-full transition-all duration-300 ${
                  isTransparent ? "bg-white" : "bg-ink"
                } ${mobileOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`}
              />
            </div>
          </button>
        </nav>

        
        <AnimatePresence>
          {mobileOpen && (
            <>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.2 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm lg:hidden z-40"
                onClick={() => setMobileOpen(false)}
              />

              
              <motion.div
                initial={{ opacity: 0.88, x: "30%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.88, x: "30%" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white shadow-2xl lg:hidden z-40 flex flex-col"
              >
                
                <div className="h-[80px] flex items-center justify-between px-6 border-b border-gray-100">
                  <span className="font-heading font-bold text-2xl text-ink">
                    LIAM<span className="text-brand-500">.</span>
                  </span>
                  <button
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                    aria-label={t("common.close")}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="space-y-1">
                    {allNavLinks.map((link, i) => {
                      
                      const linkIcon = (() => {
                        const to = link.to;
                        if (to === "/") return <Home size={18} />;
                        if (to.includes("a-propos")) return <Info size={18} />;
                        if (link.dropdown) return <LayoutGrid size={18} />;
                        if (to.includes("evenement")) return <Calendar size={18} />;
                        if (to.includes("actualite")) return <Newspaper size={18} />;
                        return <LayoutGrid size={18} />;
                      })();
                      const isActive = link.dropdown
                        ? domains.some((d) => location.pathname.includes(d.slug))
                        : location.pathname === langPath(lang || "fr", link.to) ||
                          (link.to !== "/" && location.pathname.startsWith(langPath(lang || "fr", link.to)));

                      return (
                        <motion.div
                          key={link.label}
                          custom={i}
                          variants={mobileItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {link.dropdown ? (
                            <div>
                              <button
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                  isActive
                                    ? "text-brand-600 bg-brand-50/70"
                                    : "text-gray-700 hover:bg-black/[0.03] hover:text-ink"
                                }`}
                                onClick={() => setDomainsOpen((o) => !o)}
                              >
                                <span className="flex items-center gap-3">
                                  <span
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                      isActive
                                        ? "bg-brand-500/15 text-brand-600"
                                        : "bg-black/5 text-gray-500"
                                    }`}
                                  >
                                    {linkIcon}
                                  </span>
                                  {link.label}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-300 ${
                                    domainsOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              <AnimatePresence>
                                {domainsOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <div className="ml-[52px] flex flex-col gap-0.5 border-l-2 border-brand-500/20 pl-4 pb-2 pt-1">
                                      {domains.map((d) => (
                                        <NavLink
                                          key={d.slug}
                                          to={langPath(
                                            lang || "fr",
                                            `/domaines/${d.slug}`
                                          )}
                                          end
                                          onMouseEnter={() =>
                                            prefetchRoute(`/domaines/${d.slug}`)
                                          }
                                          className={({ isActive }) =>
                                            `block py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                              isActive
                                                ? "text-brand-600 bg-brand-50"
                                                : "text-gray-600 hover:text-brand-600 hover:bg-black/[0.02]"
                                            }`
                                          }
                                          onClick={() => setMobileOpen(false)}
                                        >
                                          {t(
                                            `domains.data.${d.slug}.name`,
                                            d.name
                                          )}
                                        </NavLink>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <NavLink
                              to={langPath(lang || "fr", link.to)}
                              end={link.to === "/"}
                              onMouseEnter={() => prefetchRoute(link.to)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                  isActive
                                    ? "text-brand-600 bg-brand-50/70 font-semibold"
                                    : "text-gray-700 hover:bg-black/[0.03] hover:text-ink"
                                }`
                              }
                              onClick={() => setMobileOpen(false)}
                            >
                              <span
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                  location.pathname === langPath(lang || "fr", link.to) ||
                                  (link.to !== "/" && location.pathname.startsWith(langPath(lang || "fr", link.to)))
                                    ? "bg-brand-500/15 text-brand-600"
                                    : "bg-black/5 text-gray-500"
                                }`}
                              >
                                {linkIcon}
                              </span>
                              {link.label}
                            </NavLink>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  
                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  
                  <motion.div
                    custom={allNavLinks.length}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <button
                      onClick={() => {
                        setContactOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold text-sm transition-all duration-300 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98]"
                    >
                      <Phone size={16} />
                      {t("nav.cta")}
                    </button>
                  </motion.div>

                  
                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  
                  <motion.div
                    custom={allNavLinks.length + 1}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">
                      {t("nav.language")}
                    </p>
                    <div className="flex gap-2 px-3">
                      <button
                        onClick={() => {
                          i18n.changeLanguage("fr");
                          navigate(
                            langPath(
                              "fr",
                              location.pathname.replace(/^\/[a-z]{2}/, "") || "/"
                            )
                          );
                          setMobileOpen(false);
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          currentLang === "FR"
                            ? "bg-brand-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {t("nav.langFr")}
                      </button>
                      <button
                        onClick={() => {
                          i18n.changeLanguage("en");
                          navigate(
                            langPath(
                              "en",
                              location.pathname.replace(/^\/[a-z]{2}/, "") || "/"
                            )
                          );
                          setMobileOpen(false);
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          currentLang === "EN"
                            ? "bg-brand-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {t("nav.langEn")}
                      </button>
                    </div>
                  </motion.div>

                  
                  <motion.p
                    custom={allNavLinks.length + 2}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-6 text-center text-[11px] text-gray-400/60 tracking-wide"
                  >
                    LIAM Groupe © {new Date().getFullYear()}
                  </motion.p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}


function CartNavButton() {
  const { totalItems, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
      aria-label="Panier"
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] rounded-full bg-brand-500 text-white text-[0.5rem] font-bold flex items-center justify-center px-[3px] shadow-sm">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

function MobileCartButton() {
  const { totalItems, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="lg:hidden relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-black/5 transition-colors"
      aria-label="Panier"
    >
      <ShoppingBag className="w-5 h-5 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-brand-500 text-white text-[0.55rem] font-bold flex items-center justify-center px-[3px] shadow-sm">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
