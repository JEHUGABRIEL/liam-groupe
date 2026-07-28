"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, Mail, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase.js";
import { useSiteInfo } from "../hooks/useSiteData";
import { useFormConfig } from "../hooks/useFormConfig.js";
import DynamicForm from "./ui/DynamicForm.jsx";
import { WhatsAppIcon } from "./SocialIcons";



const EN_MARKERS = new Set([
  "the", "you", "your", "what", "who", "where", "when", "why", "how",
  "is", "are", "do", "does", "can", "will", "would", "could", "should",
  "have", "has", "had", "was", "were", "been", "being", "am", "be",
  "this", "that", "these", "those", "with", "for", "from", "about",
  "tell", "want", "know", "please", "help", "need", "like", "make",
  "hello", "hi", "thank", "thanks", "yes", "no", "not", "and", "but",
  "or", "if", "all", "some", "any", "more", "just", "also",
  "program", "programs", "sports", "health", "training", "events",
  "volunteer", "partner", "contact", "news", "team", "mission",
  "vision", "values", "info", "information", "work", "do", "does",
  "did", "done", "get", "got", "give", "take", "use", "find",
]);

const FR_MARKERS = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "au", "aux",
  "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
  "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses",
  "notre", "votre", "leur", "nos", "vos", "leurs",
  "ce", "cet", "cette", "ces", "est", "sont", "suis", "etes",
  "etait", "sera", "fait", "peut", "veux", "vais", "dois",
  "bonjour", "salut", "merci", "s il vous", "s il te",
  "quel", "quelle", "quels", "quelles", "comment", "pourquoi",
  "quand", "combien", "qui", "ou", "dans", "avec", "pour", "sur",
  "chez", "entre", "sans", "par", "c est", "dont", "donc",
  "mais", "ou", "et", "ni", "car", "rien", "tout", "beaucoup",
  "encore", "tres", "assez", "aussi", "bien", "mal", "moins",
  "plus", "si", "non", "oui", "peu", "trop",
  "que", "qui", "dont", "ou", "on",
  "aujourd", "demain", "maintenant", "apres", "avant", "toujours",
  "jamais", "parfois", "souvent", "partout",
]);

function detectLanguage(text) {
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z]+/)
    .filter(Boolean);

  if (words.length === 0) return null;

  let enScore = 0;
  let frScore = 0;

  for (const w of words) {
    if (EN_MARKERS.has(w)) enScore++;
    if (FR_MARKERS.has(w)) frScore++;
  }

  
  
  if (enScore > frScore) return "en";
  if (frScore > enScore) return "fr";
  return null;
}


const ACCENTS = /[\u0300-\u036f]/g;
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(ACCENTS, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}


const INTENT_RULES = [
  {
    key: "about",
    keywords: [
      "qui etes vous", "qui est", "presentation", "c est quoi", "a propos",
      "liam groupe", "raconte", "connaitre", "but", "mission", "oeuvre",
      "objectif", "que faites vous", "que fait", "activite",
      "who are you", "who is", "about us", "tell me about", "what is",
      "introduce", "purpose", "goal", "what do you do", "your organization",
    ],
  },
  {
    key: "programs",
    keywords: [
      "programme", "domaine", "action", "intervention", "projet",
      "vos domaines", "que faites vous", "que fait",
      "programs", "areas", "your projects", "what are your programs",
      "fields of action", "what do you work on",
    ],
  },
  {
    key: "domain_g_fitness",
    keywords: [
      "g fitness", "gfitness", "fitness", "sport", "bien etre",
      "tournoi basketball", "basketball feminin", "sante par le sport",
      "g fitness junior",
      "sports", "wellness", "basketball tournament", "health",
      "women basketball", "workout", "exercise",
    ],
  },
  {
    key: "domain_ogab",
    keywords: [
      "ogab", "o gab", "gastronomie", "culinaire", "cuisine",
      "restaurant solidaire", "atelier culinaire", "traiteur",
      "saveurs centrafrique", "produits locaux",
      "gastronomy", "cooking", "culinary", "community restaurant",
      "cooking workshop", "catering", "local food", "local products",
    ],
  },
  {
    key: "domain_entrepreneuriat",
    keywords: [
      "entrepreneuriat", "leadership feminin", "incubation",
      "oser entreprendre", "mentorat", "creation entreprise",
      "femme entrepreuneur", "business",
      "entrepreneurship", "women leadership", "incubation",
      "mentoring", "business creation", "women entrepreneur",
      "startup", "female entrepreneur",
    ],
  },
  {
    key: "domain_formation",
    keywords: [
      "formation des jeunes", "formation", "insertion", "emploi",
      "jeunes", "numerique", "professionnalisante", "stage",
      "apprentissage", "competence",
      "youth training", "training", "education", "employment",
      "youth", "digital skills", "internship", "vocational",
      "learning", "skills",
    ],
  },
  {
    key: "domain_communication",
    keywords: [
      "communication", "media", "visibilite", "presse",
      "audiovisuel", "community management", "reseaux sociaux",
      "production video", "relations presse",
      "media", "visibility", "press", "audiovisual", "social media",
      "video production", "press relations", "marketing",
    ],
  },
  {
    key: "domain_evenementiel",
    keywords: [
      "evenementiel", "culture", "gala", "miss centrafrique",
      "festival", "concours", "soiree", "spectacle", "art",
      "organisation evenement",
      "events", "cultural", "gala", "miss central africa",
      "festival", "pageant", "ceremony", "concert", "entertainment",
    ],
  },
  {
    key: "events",
    keywords: [
      "evenement", "inscrire", "inscription", "participer", "agenda",
      "tournoi", "manifestation", "calendrier", "date", "participation",
      "billet", "reserver", "quoi de neuf",
      "event", "register", "registration", "participate", "calendar",
      "tournament", "schedule", "ticket", "book", "whats coming",
      "upcoming events",
    ],
  },
  {
    key: "volunteer",
    keywords: [
      "benevole", "volontaire", "volontariat", "aider", "beneficiaire",
      "donner", "contribuer", "engagement", "rejoindre equipe",
      "volunteer", "help", "beneficiary", "donate", "contribute",
      "give back", "join our team", "give time",
    ],
  },
  {
    key: "partner",
    keywords: [
      "partenaire", "sponsor", "partenariat", "mecene", "don",
      "soutenir", "financer", "mecenat", "entreprise",
      "partner", "sponsor", "partnership", "donation", "support",
      "fund", "funding", "corporate", "invest",
    ],
  },
  {
    key: "news",
    keywords: [
      "actualite", "actus", "nouveau", "nouvelle", "publication",
      "article", "blog", "dernieres nouvelles", "infos",
      "news", "update", "updates", "article", "blog", "publication",
      "latest", "announcement", "press release",
    ],
  },
  {
    key: "location",
    keywords: [
      "adresse", "ou", "trouver", "situe", "localisation", "venir",
      "bangui", "siege", "plan", "acces",
      "address", "where", "find", "located", "location", "come",
      "headquarters", "map", "directions", "visit",
    ],
  },
  {
    key: "mission",
    keywords: [
      "vision", "valeur", "innovation", "ambition", "revele talents",
      "raison d etre", "devise", "philosophie",
      "vision", "values", "innovation", "ambition", "our mission",
      "reason for being", "motto", "philosophy", "core values",
    ],
  },
  {
    key: "team",
    keywords: [
      "equipe", "membre", "fondateur", "presidente", "direction",
      "marie claire", "ngbokoli", "qui travaille",
      "team", "member", "founder", "president", "management",
      "marie claire", "staff", "board", "leadership team",
    ],
  },
  {
    key: "liam",
    keywords: [
      "liam signifie", "acronyme", "sigle", "signification",
      "que veut dire", "que signifie",
      "liam stands for", "acronym", "meaning of liam",
      "what does liam mean", "what does it stand for",
    ],
  },
  {
    key: "faq",
    keywords: [
      "question", "faq", "demande", "frequente", "reponse",
      "comment", "pourquoi", "combien",
      "faq", "frequently asked", "how to", "why do", "answer",
      "common questions", "help",
    ],
  },
  {
    key: "contact",
    keywords: [
      "contact", "joindre", "telephone", "appeler", "email", "mail",
      "whatsapp", "message", "ecrire", "appel",
      "contact", "reach", "phone", "call", "email",
      "whatsapp", "message us", "get in touch",
    ],
  },
];


function matchScore(input, keywords) {
  let score = 0;
  for (const kw of keywords) {
    if (input.includes(kw)) {
      
      score += kw.length > 6 ? 5 : kw.length > 3 ? 3 : 1;
    }

    
    const kwWords = kw.split(/\s+/);
    if (kwWords.length > 1) {
      const allMatch = kwWords.every((w) => w.length > 2 && input.includes(w));
      if (allMatch) score += 4;
    }
  }
  return score;
}


function buildDomainResponse(t, slug) {
  const name = t(`domains.data.${slug}.name`, slug);
  const category = t(`domains.data.${slug}.category`, "");
  const shortDesc = t(`domains.data.${slug}.shortDescription`, "");
  const programs = t(`domains.data.${slug}.programs`, { returnObjects: true, defaultValue: [] });

  let response = `🏋️ *${name}*`;
  if (category) response += `\n📌 ${category}`;
  if (shortDesc) response += `\n\n${shortDesc}`;

  if (Array.isArray(programs) && programs.length > 0) {
    response += "\n\n📋 " + t("domains.programsLabel", "*Our actions:");
    programs.forEach((p) => {
      response += `\n• **${p.title}** — ${p.description}`;
    });
  }

  response += "\n\n💡 " + t("domains.cta", "Would you like to know more or support this program? Contact us!");
  return response;
}


export default function ChatBot() {
  const { t, i18n } = useTranslation();
  const { data: siteInfo = {} } = useSiteInfo();
  const { config: chatbotFormConfig } = useFormConfig("chatbot");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [responseLang, setResponseLang] = useState(
    i18n.language?.startsWith("en") ? "en" : "fr"
  );
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const rawNumber = siteInfo?.social?.whatsapp || siteInfo?.phones?.[0] || "";
  const whatsappNumber = String(rawNumber).replace(/\D/g, "");
  const contactEmail = siteInfo?.emails?.[0] || "liamgroupe236@gmail.com";

  
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      
      if (
        panelRef.current?.contains(e.target) ||
        e.target.closest(".chatbot-toggle-btn")
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  
  useEffect(() => {
    if (open && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          { role: "bot", text: t("chatbot.greeting"), id: "greeting" },
        ]);
        setShowQuickReplies(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [open, messages.length, t]);

  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  
  
  const buildResponse = useCallback(
    (key, translateFn) => {
      const tt = translateFn || t;
      switch (key) {
        case "about":
          return tt("chatbot.responses.about");
        case "programs":
          return tt("chatbot.responses.programs");
        case "events":
          return tt("chatbot.responses.events");
        case "volunteer":
          return tt("chatbot.responses.volunteer");
        case "partner":
          return tt("chatbot.responses.partner");
        case "news":
          return tt("chatbot.responses.news");
        case "location":
          return tt("chatbot.responses.location");
        case "contact":
          return tt("chatbot.responses.contact");
        case "mission":
          return (
            tt("about.missionBlock.text") +
            "\n\n" +
            tt("about.vision.text") +
            "\n\n📊 " +
            tt("home.stats.items", { returnObjects: true })
              .map((s) => `${s.value}${s.suffix} — ${s.label}`)
              .join("\n")
          );
        case "team":
          return tt("about.team.description");
        case "liam":
          return tt("about.acronym.items", { returnObjects: true })
            .map((item) => `• **${item.letter}** — ${item.word} : ${item.text}`)
            .join("\n\n");
        case "faq":
          return tt("home.faq.items", { returnObjects: true })
            .slice(0, 3)
            .map((faq) => `❓ *${faq.question}*\n${faq.answer}`)
            .join("\n\n");
        case "domain_g_fitness":
          return buildDomainResponse(tt, "g-fitness");
        case "domain_ogab":
          return buildDomainResponse(tt, "ogab");
        case "domain_entrepreneuriat":
          return buildDomainResponse(tt, "entrepreneuriat");
        case "domain_formation":
          return buildDomainResponse(tt, "formation");
        case "domain_communication":
          return buildDomainResponse(tt, "communication");
        case "domain_evenementiel":
          return buildDomainResponse(tt, "evenementiel");
        default:
          return tt(`chatbot.responses.${key}`);
      }
    },
    [t]
  );

  
  const findBestMatch = useCallback((input) => {
    const normalized = normalize(input);
    if (!normalized) return { key: null, score: 0 };

    let best = { key: null, score: 0 };
    for (const rule of INTENT_RULES) {
      const score = matchScore(normalized, rule.keywords);
      if (score > best.score) {
        best = { key: rule.key, score };
      }
    }
    return best;
  }, []);

  
  const addBotMessage = useCallback(
    (text, delay = 600) => {
      setTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text, id: Date.now().toString() }]);
        setTyping(false);
      }, delay);
    },
    []
  );

  
  useEffect(() => {
    if (!typing && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'bot') {
        const timer = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
      }
    }
  }, [typing, messages]);

  
  const handleMessage = useCallback(
    (text, intentKey) => {
      setShowQuickReplies(false);
      setShowForm(false);

      
      setMessages((prev) => [
        ...prev,
        { role: "user", text, id: Date.now().toString() },
      ]);

      
      const userLang = detectLanguage(text);
      const interfaceLang = i18n.language?.startsWith("en") ? "en" : "fr";
      
      const detected = userLang || interfaceLang;
      setResponseLang(detected);

      
      
      const responseT = detected !== interfaceLang
        ? i18n.getFixedT(detected)
        : null;

      let key = intentKey;
      if (!key) {
        
        const match = findBestMatch(text);
        key = match.key;
      }

      if (key) {
        
        const response = buildResponse(key, responseT);
        const needsForm = key === "contact" || key === "partner" || key === "volunteer";

        addBotMessage(response, 800);

        if (needsForm) {
          setTimeout(() => setShowForm(true), 1500);
        } else {
          setTimeout(() => setShowQuickReplies(true), 3000);
        }
      } else {
        
        const tt = responseT || t;
        const fallback = tt("chatbot.responses.contact");

        addBotMessage(
          `${tt("chatbot.fallback")}\n\n💡 ${fallback}`,
          800
        );
        setTimeout(() => setShowQuickReplies(true), 3000);
      }
    },
    [t, i18n, addBotMessage, findBestMatch, buildResponse]
  );

  const handleQuickReply = useCallback(
    (key) => {
      
      const interfaceLang = i18n.language?.startsWith("en") ? "en" : "fr";
      const qrT = responseLang !== interfaceLang
        ? i18n.getFixedT(responseLang)
        : t;
      const label = qrT(`chatbot.quickReplies.${key}`);
      handleMessage(label, key);
    },
    [t, i18n, responseLang, handleMessage]
  );

  
  const handleInputSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const text = inputValue.trim();
      if (!text) return;
      setInputValue("");
      handleMessage(text, null);
    },
    [inputValue, handleMessage]
  );

  const handleFormSubmit = async (values) => {
    try {
      const nameParts = (values.name || values.firstname || "").trim().split(/\s+/);
      const { error } = await supabase.from("messages").insert({
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        email: values.email || "",
        phone: values.phone || "",
        subject: "Message depuis le chatbot",
        message: values.message || "",
        page: "chatbot",
        data: values,
      });
      if (error) throw error;

      setShowForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: `✉️ ${values.name || values.firstname || ""} — ${values.email || ""}${values.phone ? ` — ${values.phone}` : ""}\n${values.message || ""}`,
          id: Date.now().toString(),
        },
      ]);
      addBotMessage(t("chatbot.formSuccess"), 1000);
    } catch (err) {
      console.error("ChatBot — Erreur d'envoi :", err);
      addBotMessage("❌ Erreur lors de l'envoi. Veuillez réessayer.", 500);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowQuickReplies(true);
    setShowForm(false);
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) {
      
      if (messages.length > 0 && !showQuickReplies && !showForm) {
        resetChat();
      }
    }
  };

  return (
    <>
      
      <button
        onClick={handleToggle}
        aria-label={open ? t("chatbot.closeChat") : t("chatbot.openChat")}
        className="chatbot-toggle-btn group fixed bottom-6 right-6 z-40 flex items-center gap-0 overflow-hidden rounded-full bg-brand-500 text-white shadow-lg shadow-black/20 transition-all duration-300 hover:gap-3 hover:pr-5 hover:shadow-xl active:scale-95"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
          {open ? (
            <X className="h-7 w-7" />
          ) : (
            <MessageSquare className="h-7 w-7" />
          )}
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-xs">
          {t("chatbot.openChat")}
        </span>
      </button>

      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-3 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-[380px] h-[600px] max-h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            
            <div className="bg-brand-500 text-white px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{t("chatbot.chatTitle")}</p>
                <p className="text-xs text-white/70">{t("chatbot.chatSubtitle")}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t("whatsapp.prefilledMessage"))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition-colors shrink-0 group relative"
                    aria-label={t("whatsapp.ariaLabel")}
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {t("whatsapp.cta")}
                    </span>
                  </a>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
                  aria-label={t("chatbot.closeChat")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-brand-500 text-white rounded-br-md"
                        : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-500 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              
              {showQuickReplies && !typing && (() => {
                const interfaceLang = i18n.language?.startsWith("en") ? "en" : "fr";
                const qrT = responseLang !== interfaceLang
                  ? i18n.getFixedT(responseLang)
                  : t;
                const replies = qrT("chatbot.quickReplies", { returnObjects: true });
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {Object.entries(replies).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleQuickReply(key)}
                        className="text-xs font-medium px-3.5 py-2 rounded-full bg-white border border-brand-200 text-brand-600 hover:bg-brand-50 hover:border-brand-300 transition-colors active:scale-95"
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                );
              })()}

              
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-100 space-y-3"
                >
                  <DynamicForm
                    fields={chatbotFormConfig}
                    onSubmit={handleFormSubmit}
                    submitLabel={t("chatbot.formSubmit")}
                  />

                  
                  <div className="pt-3 space-y-2.5 border-t border-gray-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {t("contact.socialTitle")} 
                    </p>
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t("whatsapp.prefilledMessage"))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-xl px-3.5 py-2.5 transition-all group"
                      >
                        <WhatsAppIcon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{t("chatbot.viaWhatsapp")}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    )}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-brand-600 bg-gray-50 hover:bg-brand-50 rounded-xl px-3.5 py-2.5 transition-all group"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{t("chatbot.viaEmail")}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            
            <form
              onSubmit={handleInputSubmit}
              className="px-2 sm:px-3 py-2 sm:py-3 border-t border-gray-100 bg-white shrink-0 flex items-center gap-1.5 sm:gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t("chatbot.inputPlaceholder")}
                className="flex-1 border border-gray-200 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-brand-400 transition-colors"
                autoComplete="off"
                autoCorrect={i18n.language?.startsWith("en") ? "on" : "off"}
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0 active:scale-95"
                aria-label={t("chatbot.formSubmit")}
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
