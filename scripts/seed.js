// scripts/seed.js
// =====================================================
// Script de seed automatisé — Insère les données mock
// dans Supabase.
// Usage : npm run seed
// =====================================================
// Script autonome : les données sont embarquées pour
// éviter les problèmes de résolution de modules Node.js
// (les imports sans extension .js de siteData.js
//  nécessitent un bundler comme webpack/turbopack).
// =====================================================

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const CLOUD = 'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto';
const img = (seed, w = 800, h = 600) => `${CLOUD},w_${w},h_${h},c_fill,dpr_auto/v1/liam-groupe/${seed}`;
const imgHero = (seed) => `${CLOUD},w_1920,h_700,c_fill,dpr_auto/v1/liam-groupe/${seed}`;

// =====================================================
// Configuration Supabase
// =====================================================
// Le seed utilise la clé service_role (bypass RLS) car
// les politiques RLS n'autorisent que les admins
// authentifiés à écrire dans les tables.
//
// Ajoute dans .env :
//   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
//
// Trouve la clé dans : Supabase Dashboard > Settings > API > service_role key
// =====================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL manquante dans .env');
  process.exit(1);
}
if (!supabaseKey) {
  console.error('❌ Clé Supabase manquante. Ajoute SUPABASE_SERVICE_ROLE_KEY dans .env');
  console.error('   Ou à défaut NEXT_PUBLIC_SUPABASE_ANON_KEY (mais les écritures RLS échoueront)');
  process.exit(1);
}

const usingServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!usingServiceRole) {
  console.log('⚠️  Utilisation de la clé anon — les écritures risquent d\'être bloquées par RLS.');
  console.log('   Ajoute SUPABASE_SERVICE_ROLE_KEY dans .env pour un seed sans contrainte.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

let totalInserted = 0;
let totalErrors = 0;

function logResult(table, ok, count) {
  if (ok) {
    console.log(`  ✅ ${table} : ${count} inséré(s)`);
    totalInserted += count;
  } else {
    console.error(`  ❌ ${table} : ÉCHEC`);
    totalErrors++;
  }
}

// =====================================================
// DONNÉES EMBARQUÉES
// =====================================================

const settingsData = [
  {
    key: "siteInfo",
    value: {
      name: "LIAM",
      fullName: "LIAM Groupe",
      tagline: "Révéler les talents, créer des opportunités durables",
      description: "Structure pluridisciplinaire développant des projets culturels, sportifs, entrepreneuriaux et gastronomiques à fort impact social en République Centrafricaine.",
      foundingYear: 2015,
      social: {
        whatsapp: "23676000000",
        facebook: "https://www.facebook.com/people/LIAM-Groupe/61585885973346/",
        instagram: "https://instagram.com/liamgroupe",
        x: "https://x.com/liamgroupe",
        youtube: "https://youtube.com/@liamgroupe",
      },
      contactPage: {
        address: ["Rue Maurice Dejean, Bâtiment Hôtel Levy's", "Bangui, République Centrafricaine"],
        phones: ["+236 76 03 03 03", "+236 74 68 28 28"],
        emails: ["liamgroupe236@gmail.com"],
        hours: ["Lundi — Vendredi : 8h00 — 17h00", "Samedi : 9h00 — 12h00"],
      },
    },
  },
  {
    key: "navLinks",
    value: [
      { label: "Accueil", to: "/" },
      { label: "À propos", to: "/a-propos" },
      { label: "Domaines", to: "/domaines", dropdown: true },
      { label: "Boutique", to: "/boutique" },
      { label: "Événements", to: "/evenements" },
      { label: "Actualités", to: "/actualites" },
    ],
  },
  {
    key: "homeHeroImages",
    value: [
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/home-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/apropos-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/evenements-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/actualites-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/partenaires-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/gfitness-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/ogab-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/entreprenariat-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/formation-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/communication-hero`,
      `${CLOUD},w_1920,h_1080,c_fill,dpr_auto/v1/liam-groupe/evenementiel-hero`,
    ],
  },
  {
    key: "footerLinks",
    value: {
      liamGroupe: [
        { label: "Notre mission", to: "/a-propos" },
        { label: "Notre équipe", to: "/a-propos" },
        { label: "Nous soutenir", to: "/a-propos" },
      ],
      domaines: [
        { label: "G-Fitness", to: "/domaines/g-fitness" },
        { label: "O'GAB", to: "/domaines/ogab" },
        { label: "Entrepreneuriat & Leadership", to: "/domaines/entrepreneuriat" },
        { label: "Formation des Jeunes", to: "/domaines/formation" },
        { label: "Communication", to: "/domaines/communication" },
        { label: "Événementiel", to: "/domaines/evenementiel" },
        { label: "Miss Centrafrique", to: "/domaines/miss-centrafrique" },
      ],
      agir: [
        { label: "Boutique", to: "/boutique" },
        { label: "Événements à venir", to: "/evenements" },
        { label: "Actualités", to: "/actualites" },
      ],
    },
  },
];

const menuItemsData = [
  // Entrées
  { domain_slug: "ogab", category: "Entrées",    name: "Beignets de manioc",    description: "Servis avec une sauce pili-pili maison",                    price: "1 500 FCFA", image: "/images/ogab/menu/viandes/477298492_1235434640955067_169714496242722070_n.jpg", order_index: 0 },
  { domain_slug: "ogab", category: "Entrées",    name: "Salade de gombo",       description: "Gombo frais, tomate, oignon, citron vert",                   price: "1 500 FCFA", image: "/images/ogab/menu/viandes/476831715_1175434967621701_7374471415607115478_n.jpg", order_index: 1 },
  { domain_slug: "ogab", category: "Entrées",    name: "Brochettes de bœuf",    description: "Marinade aux épices locales",                               price: "2 000 FCFA", image: "/images/ogab/menu/viandes/481295668_1192063702625494_7453928178350659803_n.jpg", order_index: 2 },
  // Plats
  { domain_slug: "ogab", category: "Plats",      name: "Ngunza (feuilles de manioc)", description: "Mijoté à la viande de bœuf, riz blanc",                 price: "3 500 FCFA", image: "/images/ogab/menu/viandes/477806116_1177421537423044_4425753917222172309_n.jpg", order_index: 3 },
  { domain_slug: "ogab", category: "Plats",      name: "Poulet Moambé",         description: "Sauce à la noix de palme, banane plantain",                    price: "4 000 FCFA", image: "/images/ogab/menu/viandes/481817459_1192451379253393_3693422543224332807_n.jpg", order_index: 4 },
  { domain_slug: "ogab", category: "Plats",      name: "Poisson braisé",        description: "Capitaine grillé, attiéké, sauce tomate",                      price: "4 500 FCFA", image: "/images/ogab/menu/poissons/476743183_1176866707478527_8961538709356112358_n.jpg", order_index: 5 },
  { domain_slug: "ogab", category: "Plats",      name: "Saka-Saka",             description: "Feuilles de manioc pilées, arachide, riz",                     price: "3 000 FCFA", image: "/images/ogab/menu/viandes/479125158_1175434917621706_5041772538801672612_n.jpg", order_index: 6 },
  // Desserts
  { domain_slug: "ogab", category: "Desserts",   name: "Beignets sucrés",       description: "Servis chauds avec miel local",                               price: "1 000 FCFA", image: "/images/ogab/menu/viandes/477816060_1176846190813912_1134994849215330419_n.jpg", order_index: 7 },
  { domain_slug: "ogab", category: "Desserts",   name: "Salade de fruits de saison", description: "Ananas, mangue, papaye",                              price: "1 500 FCFA", image: "/images/ogab/menu/viandes/479187818_1176865460811985_5121735192033802936_n.jpg", order_index: 8 },
  // Boissons
  { domain_slug: "ogab", category: "Boissons",   name: "Jus de bissap",         description: "Fait maison, peu sucré",                                     price: "1 000 FCFA", image: "/images/ogab/drinks/480593977_1182975440200987_1334761629428138187_n.jpg", order_index: 9 },
  { domain_slug: "ogab", category: "Boissons",   name: "Jus de gingembre",      description: "Fait maison",                                               price: "1 000 FCFA", image: "/images/ogab/drinks/481352488_1191077582724106_3638396413268265364_n.jpg", order_index: 10 },
  { domain_slug: "ogab", category: "Boissons",   name: "Eau minérale",          description: "50cl",                                                       price: "500 FCFA",  image: "/images/ogab/drinks/481469421_1192451435920054_9157719752898810166_n.jpg", order_index: 11 },
];

const eventsData = [
  {
    slug: "tournoi-feminin-basketball-2026",
    title: "Tournoi Féminin de Basketball — Édition 2026",
    date: "15 Août 2026",
    location: "Gymnase Omnisports de Bangui",
    category: "G-Fitness",
    status: "a_venir",
    image: img("event-basketball"),
    description: "La 3ème édition du tournoi inter-quartiers de basketball féminin rassemble 16 équipes pour une compétition de haut niveau….",
    order_index: 0,
  },
  {
    slug: "conference-leadership-feminin",
    title: "Conférence Leadership Féminin — « Oser Entreprendre »",
    date: "28 Juin 2026",
    location: "Salle de Conférence ASK Gras Savoye, Bangui",
    category: "Entrepreneuriat",
    status: "a_venir",
    image: img("event-conference"),
    description: "Une journée de partage et d'inspiration avec des femmes leaders du secteur privé et public centrafricain. Ateliers pratiques,…",
    order_index: 1,
  },
  {
    slug: "atelier-formation-creation-entreprise",
    title: "Atelier Formation — Création d'Entreprise",
    date: "10 Juillet 2026",
    location: "Siège LIAM Groupe, Bangui",
    category: "Formation",
    status: "a_venir",
    image: img("event-formation"),
    description: "Formation intensive de 3 jours pour les jeunes entrepreneurs. Business model, financement, marketing digital et gestion…",
    order_index: 2,
  },
  {
    slug: "soiree-gala-liam-2025",
    title: "Soirée de Gala — LIAM Groupe 2025",
    date: "20 Décembre 2025",
    location: "Hôtel Ledger Plaza, Bangui",
    category: "Événementiel",
    status: "passe",
    image: img("event-gala"),
    description: "Une soirée prestigieuse réunissant partenaires, sponsors et personnalités pour célébrer les réalisations de l'année….",
    order_index: 3,
  },
  {
    slug: "atelier-gastronomie-saveurs-centrafrique",
    title: "Atelier Gastronomie — Saveurs de Centrafrique",
    date: "10 Novembre 2025",
    location: "Espace O'GAB, Bangui",
    category: "O'GAB",
    status: "passe",
    image: img("event-gastronomie"),
    description: "Atelier culinaire mettant à l'honneur les produits locaux et le savoir-faire des femmes centrafricaines. Dégustation et…",
    order_index: 4,
  },
  {
    slug: "miss-centrafrique-2025",
    title: "Miss Centrafrique 2025",
    date: "15 Octobre 2025",
    location: "Salle King, Bangui",
    category: "Miss Centrafrique",
    status: "passe",
    image: "/images/miss_centrafrique/652260934_122213049812493986_1741650240073091187_n.jpg",
    description: "Concours de beauté et de culture célébrant la diversité et la richesse culturelle de la République Centrafricaine. Plus de 5000…",
    order_index: 5,
  },
  {
    slug: "casting-regional-miss-centrafrique-2026",
    title: "Casting Régional — Miss Centrafrique 2026",
    date: "5 Septembre 2026",
    location: "Bouar, Berbérati, Bangassou (tournée régionale)",
    category: "Miss Centrafrique",
    status: "a_venir",
    image: "/images/miss_centrafrique/657846609_122214853046493986_902888607739175824_n.jpg",
    description: "Tournée de sélection dans les principales villes du pays pour repérer les candidates de l'édition 2026. Inscriptions ouvertes aux femmes de 18 à 26 ans…",
    order_index: 6,
  },
];

const newsData = [
  {
    slug: "prix-innovation-sociale-2026",
    title: "LIAM Groupe remporte le prix de l'Innovation Sociale 2026",
    excerpt: "Reconnue pour son impact sur l'entrepreneuriat féminin en Centrafrique, LIAM Groupe a été récompensée lors du…",
    content: "Reconnue pour son impact sur l'entrepreneuriat féminin en Centrafrique, LIAM Groupe a été récompensée lors du Forum National de l'Innovation Sociale qui s'est tenu à Bangui. Ce prix salue plus de dix années d'actions concrètes en faveur de l'autonomisation des femmes et des jeunes centrafricains.\n\nLe jury a particulièrement retenu l'approche intégrée de l'organisation, qui combine formation, accompagnement entrepreneurial et mise en réseau à travers ses différents programmes : G-Fitness, O'GAB, Entrepreneuriat & Leadership et Formation des Jeunes.\n\n« Cette distinction appartient avant tout aux centaines de femmes et de jeunes qui, chaque jour, portent nos programmes sur le terrain », a déclaré la Présidente de LIAM Groupe lors de la remise du prix. L'organisation entend désormais accélérer le déploiement de ses initiatives dans d'autres préfectures du pays.",
    image: img("news-prix"),
    date: "12 Juin 2026",
    tags: ["ACTUALITÉ"],
    author: "Équipe Communication LIAM Groupe",
    order_index: 0,
  },
  {
    slug: "partenariat-minusca",
    title: "Nouveau partenariat avec la MINUSCA pour la paix par le sport",
    excerpt: "Un accord de coopération a été signé pour organiser des tournois inter-communautaires dans les préfectures de…",
    content: "Un accord de coopération a été signé entre LIAM Groupe et la MINUSCA pour organiser des tournois sportifs inter-communautaires dans plusieurs préfectures du pays. L'objectif : utiliser le sport comme outil de cohésion sociale et de réconciliation entre les communautés.\n\nLe programme G-Fitness, déjà reconnu à Bangui pour ses tournois féminins de basketball, servira de socle méthodologique à cette initiative élargie. Des rencontres sportives mixtes seront organisées dans les prochains mois, encadrées par des animateurs formés aux enjeux de dialogue communautaire.\n\nCe partenariat s'inscrit dans la continuité des actions de LIAM Groupe pour une Centrafrique apaisée, où le sport devient un langage commun au-delà des divisions.",
    image: img("news-minusca"),
    date: "3 Mai 2026",
    tags: ["PARTENARIAT"],
    author: "Équipe Communication LIAM Groupe",
    order_index: 1,
  },
  {
    slug: "ogab-restaurant-solidaire",
    title: "O'GAB ouvre son premier restaurant solidaire à Bangui",
    excerpt: "Le restaurant O'GAB emploie 15 femmes formées par LIAM Groupe et propose une cuisine 100% locale à des prix accessibles.",
    content: "Le restaurant O'GAB a ouvert ses portes au cœur de Bangui. Il emploie 15 femmes formées par LIAM Groupe dans le cadre de son programme de gastronomie solidaire, et propose une cuisine 100% locale à des prix accessibles à tous les Banguissois.\n\nAu-delà de la restauration, l'établissement sert de vitrine pour les produits du terroir centrafricain et de lieu de formation continue pour de nouvelles promotions de femmes entrepreneures.\n\n« Chaque plat servi ici raconte une histoire de résilience et de savoir-faire », confie l'une des cheffes formées par le programme O'GAB. Le restaurant est ouvert du lundi au samedi, de 11h à 21h.",
    image: img("news-ogab"),
    date: "18 Avril 2026",
    tags: ["O'GAB"],
    author: "Équipe Communication LIAM Groupe",
    order_index: 2,
  },
  {
    slug: "500-jeunes-formes-numerique",
    title: "500 jeunes formés aux métiers du numérique en 2025",
    excerpt: "Bilan de l'année écoulée pour le programme de formation des jeunes : 500 diplômés, 120 emplois créés et 30 startups…",
    content: "Le bilan de l'année 2025 pour le programme Formation des Jeunes de LIAM Groupe est sans appel : 500 jeunes diplômés dans les métiers du numérique, du développement web à la communication digitale en passant par la gestion de projet.\n\nSur ces 500 diplômés, 120 ont déjà décroché un emploi et une trentaine ont lancé leur propre startup avec l'appui du programme d'incubation de LIAM Groupe. Des résultats qui confirment la pertinence d'une formation courte, pratique et ancrée dans les besoins réels du marché centrafricain.\n\nPour 2026, l'organisation prévoit de doubler sa capacité d'accueil et d'ouvrir de nouvelles filières, notamment autour du commerce en ligne et du Mobile Money.",
    image: img("news-formation"),
    date: "10 Mars 2026",
    tags: ["FORMATION"],
    author: "Équipe Communication LIAM Groupe",
    order_index: 3,
  },
  {
    slug: "tournoi-basketball-10000-spectateurs",
    title: "Le Tournoi Féminin de Basketball atteint 10 000 spectateurs",
    excerpt: "Record d'affluence battu pour la finale du tournoi inter-quartiers. Un événement qui confirme l'engouement croissant pour le…",
    content: "La finale du Tournoi Féminin de Basketball, organisée par le programme G-Fitness de LIAM Groupe, a rassemblé plus de 10 000 spectateurs au Gymnase Omnisports de Bangui, un record d'affluence pour cet événement désormais incontournable.\n\nSeize équipes issues de différents quartiers de la capitale se sont affrontées pendant deux semaines dans une ambiance festive. La finale a été marquée par la présence de plusieurs personnalités publiques venues soutenir l'initiative.\n\nFort de ce succès, LIAM Groupe annonce déjà une édition 2027 élargie à d'autres villes du pays, avec pour ambition de faire de ce tournoi un rendez-vous national.",
    image: img("news-basketball"),
    date: "22 Février 2026",
    tags: ["G-FITNESS"],
    author: "Équipe Communication LIAM Groupe",
    order_index: 4,
  },
  {
    slug: "entretien-marie-claire-ngbokoli",
    title: "Entretien avec Marie-Claire Ngbokoli : « L'avenir passe par la jeunesse »",
    excerpt: "La fondatrice de LIAM Groupe se confie sur les défis de l'ONG, ses réussites et ses projets pour les années à venir.",
    content: "Onze ans après la création de LIAM Groupe, sa fondatrice Marie-Claire Ngbokoli revient sur le chemin parcouru : « Nous sommes partis d'un petit groupe de femmes déterminées à Bangui, et aujourd'hui nos programmes touchent des milliers de bénéficiaires à travers le pays. »\n\nInterrogée sur les défis, elle évoque le manque de financement structurel des ONG centrafricaines et la nécessité de diversifier les partenariats, notamment avec le secteur privé local. « Chaque partenaire qui nous rejoint, c'est un projet de plus qui voit le jour pour une femme ou un jeune de ce pays. »\n\nPour les années à venir, elle annonce une ambition claire : étendre les programmes de LIAM Groupe à l'ensemble des préfectures de la République Centrafricaine, en s'appuyant sur les relais locaux formés depuis 2015.",
    image: img("news-portrait"),
    date: "5 Janvier 2026",
    tags: ["PORTRAIT"],
    author: "Équipe Communication LIAM Groupe",
    order_index: 5,
  },
  {
    slug: "lancement-castings-miss-centrafrique-2026",
    title: "Ouverture des castings pour Miss Centrafrique 2026",
    excerpt: "LIAM Groupe lance la tournée régionale de sélection pour la 12ème édition du concours, avec une étape dans trois nouvelles villes cette année.",
    content: "LIAM Groupe annonce l'ouverture des inscriptions pour la 12ème édition de Miss Centrafrique. Les candidates de 18 à 26 ans peuvent se présenter aux castings régionaux organisés à Bouar, Berbérati et Bangassou avant la grande finale prévue à Bangui.\n\nAu-delà du concours de beauté, le programme met l'accent sur la culture et l'engagement social : les candidates suivront des ateliers de leadership et de prise de parole en public animés par l'équipe Entrepreneuriat & Leadership de LIAM Groupe.\n\nLa lauréate 2026 rejoindra, comme ses devancières, les actions de sensibilisation portées par LIAM Groupe tout au long de son mandat d'un an.",
    image: img("event-miss"),
    date: "20 Juillet 2026",
    tags: ["Miss Centrafrique"],
    author: "Équipe Communication LIAM Groupe",
    order_index: 6,
  },
];

const domainsData = [
  {
    slug: "g-fitness",
    name: "G-Fitness",
    category: "SPORT & FITNESS",
    short_description: "Une salle de fitness moderne au cœur de Bangui : cours collectifs, coaching personnalisé et musculation, ouverte à tous, avec des programmes dédiés aux femmes et aux jeunes. Espace complet, coachs certifiés…",
    icon: "dumbbell",
    hero_image: imgHero("gfitness-hero"),
    programs: [
      { title: "Musculation & Cardio", description: "Plateau équipé (haltères, machines guidées, tapis, vélos) en accès libre avec suivi par nos coachs." },
      { title: "Cours collectifs", description: "Zumba, step, renforcement musculaire et yoga, plusieurs séances par semaine pour tous les niveaux." },
      { title: "Coaching personnalisé", description: "Programmes individuels (perte de poids, prise de masse, remise en forme) avec suivi nutritionnel." },
      { title: "Tournoi Féminin de Basketball", description: "Compétition inter-quartiers rassemblant 16 équipes féminines à Bangui, portée par nos coachs." },
      { title: "G-Fitness Junior", description: "Programme d'initiation sportive pour les enfants et adolescents des quartiers défavorisés." },
      { title: "Santé par le sport", description: "Ateliers de sensibilisation à l'hygiène de vie et à la nutrition équilibrée." },
      { title: "Randonnées du samedi", description: "Marches en groupe à travers les collines de Bangui et environs. Accessible à tous les niveaux, une façon conviviale de découvrir la nature centrafricaine." },
    ],
    gallery: [
      img("gfitness-gallery-1", 700, 500),
      img("gfitness-gallery-2", 700, 500),
      img("gfitness-gallery-3", 700, 500),
      img("gfitness-gallery-4", 700, 500),
    ],
    order_index: 0,
  },
  {
    slug: "ogab",
    name: "O'GAB",
    category: "RESTAURANT & GASTRONOMIE",
    short_description: "Le restaurant solidaire de LIAM Groupe à Bangui : une cuisine centrafricaine authentique et généreuse, préparée par des femmes formées dans nos ateliers culinaires, dans un cadre chaleureux ouvert midi et soir.",
    icon: "utensils",
    hero_image: "/images/ogab/669011058_1446562997267831_5481903344405057979_n.jpg",
    programs: [
      { title: "Restaurant solidaire", description: "Salle ouverte tous les jours, cuisine centrafricaine et internationale accessible, préparée et servie par des femmes formées dans nos ateliers." },
      { title: "Restauration événementielle", description: "Service traiteur pour mariages, séminaires et réceptions, valorisant les produits locaux." },
      { title: "Ateliers culinaires", description: "Formation en cuisine traditionnelle et moderne pour les femmes entrepreneures." },
    ],
    gallery: [
      "/images/ogab/drinks/476872713_1176865404145324_5802838533451008756_n.jpg",
      "/images/ogab/menu/viandes/481063852_1187765299722001_5650020998460137576_n.jpg",
      "/images/ogab/menu/poissons/478327053_1176866517478546_315024763193329332_n.jpg",
      "/images/ogab/drinks/482138664_1192591909239340_9009025277274740992_n.jpg",
      "/images/ogab/menu/viandes/481114410_1191086432723221_2914556064497715437_n.jpg",
      "/images/ogab/menu/crevettes/481678689_1191077416057456_8939253051982806889_n.jpg",
      "/images/ogab/menu/viandes/481180074_1191086439389887_8362481496169952499_n.jpg",
    ],
    order_index: 1,
  },
  {
    slug: "entrepreneuriat",
    name: "Entrepreneuriat & Leadership",
    category: "LEADERSHIP FÉMININ",
    short_description: "Autonomiser les femmes centrafricaines par la formation au leadership, l'accompagnement entrepreneurial et la mise en réseau…",
    icon: "briefcase",
    hero_image: imgHero("entreprenariat-hero"),
    programs: [
      { title: "Conférences « Oser Entreprendre »", description: "Événements inspirants avec des femmes leaders du secteur privé et public." },
      { title: "Programme d'incubation", description: "Accompagnement de 6 mois pour les projets entrepreneuriaux féminins." },
      { title: "Mentorat", description: "Mise en relation entre entrepreneures débutantes et mentors expérimentés." },
    ],
    gallery: [
      img("entreprenariat-gallery-1", 700, 500),
      img("entreprenariat-gallery-2", 700, 500),
    ],
    order_index: 2,
  },
  {
    slug: "formation",
    name: "Formation des Jeunes",
    category: "ÉDUCATION & INSERTION",
    short_description: "Offrir aux jeunes centrafricains des formations pratiques et professionnalisantes pour favoriser leur insertion sur le marché du travail. Ateliers,…",
    icon: "graduation",
    hero_image: imgHero("formation-hero"),
    programs: [
      { title: "Formation professionnelle", description: "Ateliers pratiques dans les métiers du numérique, de la cuisine, de la communication." },
      { title: "Stages en entreprise", description: "Mise en relation avec des partenaires employeurs pour des stages rémunérés." },
      { title: "Programme de mentorat", description: "Accompagnement individuel des jeunes par des professionnels expérimentés." },
    ],
    gallery: [
      img("formation-gallery-1", 700, 500),
      img("formation-gallery-2", 700, 500),
    ],
    order_index: 3,
  },
  {
    slug: "communication",
    name: "Communication",
    category: "VISIBILITÉ & MÉDIAS",
    short_description: "Assurer la visibilité des actions de LIAM Groupe et de ses partenaires à travers une stratégie de communication moderne : relations presse,…",
    icon: "megaphone",
    hero_image: imgHero("communication-hero"),
    programs: [
      { title: "Relations presse", description: "Couverture médiatique des événements et diffusion des communiqués aux médias locaux et internationaux." },
      { title: "Production audiovisuelle", description: "Création de documentaires, reportages et contenus digitaux mettant en valeur nos actions." },
      { title: "Community management", description: "Gestion des réseaux sociaux et engagement de la communauté en ligne." },
    ],
    gallery: [
      img("communication-gallery-1", 700, 500),
      img("communication-gallery-2", 700, 500),
    ],
    order_index: 4,
  },
  {
    slug: "evenementiel",
    name: "Événementiel",
    category: "CULTURE & GALAS",
    short_description: "Organiser des événements d'envergure qui rassemblent, inspirent et célèbrent la culture centrafricaine. Galas de charité, festivals…",
    icon: "calendar",
    hero_image: imgHero("evenementiel-hero"),
    programs: [
      { title: "Gala de charité", description: "Soirée prestigieuse réunissant partenaires et donateurs pour le financement des programmes." },
      { title: "Festivals culturels", description: "Manifestations artistiques mettant en valeur la musique, la danse et les arts locaux." },
      { title: "Nuit du Patrimoine", description: "Soirée dédiée à la valorisation du patrimoine culturel et artisanal centrafricain." },
    ],
    gallery: [
      img("evenementiel-gallery-1", 700, 500),
      img("evenementiel-gallery-2", 700, 500),
    ],
    order_index: 5,
  },
  {
    slug: "miss-centrafrique",
    name: "Miss Centrafrique",
    category: "ÉVÉNEMENT & CULTURE",
    short_description: "Le grand concours national de beauté et de culture, organisé chaque année par LIAM Groupe pour célébrer la diversité et le talent des femmes centrafricaines à travers tout le pays.",
    icon: "crown",
    hero_image: "/images/miss_centrafrique/660293914_122214852962493986_3925101421778963041_n.jpg",
    programs: [
      { title: "Édition annuelle Miss Centrafrique", description: "Concours national réunissant des candidates des 16 préfectures pour la grande finale à Bangui." },
      { title: "Casting régional", description: "Tournée de sélection dans les principales villes du pays pour repérer les candidates." },
      { title: "Programme social des lauréates", description: "Les lauréates portent pendant un an des actions de sensibilisation aux côtés des programmes LIAM (éducation, santé, entrepreneuriat féminin)." },
    ],
    gallery: [
      "/images/miss_centrafrique/602360568_122201092124493986_1040350237599525467_n.jpg",
      "/images/miss_centrafrique/602369447_122201092304493986_1654277192015430010_n.jpg",
      "/images/miss_centrafrique/602942164_122201091986493986_7876967984288534926_n.jpg",
      "/images/miss_centrafrique/602970718_122201092028493986_1341360414517098757_n.jpg",
      "/images/miss_centrafrique/603877467_122201091788493986_6848310215721556803_n.jpg",
      "/images/miss_centrafrique/604842510_122201091902493986_5059305910630420651_n.jpg",
      "/images/miss_centrafrique/605839126_122201092082493986_7051333952073355898_n.jpg",
      "/images/miss_centrafrique/652260934_122213049812493986_1741650240073091187_n.jpg",
      "/images/miss_centrafrique/657846609_122214853046493986_902888607739175824_n.jpg",
    ],
    order_index: 6,
  },
];

const productsData = [
  {
    slug: "casquette-liam",
    name: "Casquette LIAM Groupe",
    description: "Casquette ajustable brodée au logo LIAM Groupe. Disponible en noir et blanc.",
    price: "5 000 FCFA",
    image: "/images/Nos_produits/749354955_1658208996311419_3819724823827381595_n.jpg",
    category: "Accessoires",
    domain: "liam-groupe",
    order_index: 0,
  },
  {
    slug: "sac-main-gfitness",
    name: "Sac à main G-Fitness",
    description: "Sac cabas en coton recyclé avec impression sérigraphiée G-Fitness. Idéal pour le sport et le quotidien.",
    price: "7 000 FCFA",
    image: "/images/Nos_produits/sacs/749652135_1658209169644735_5658764887506984283_n.jpg",
    category: "Accessoires",
    domain: "g-fitness",
    order_index: 1,
  },
  {
    slug: "t-shirt-liam",
    name: "T-shirt LIAM Groupe",
    description: "T-shirt en coton bio, coupe standard, logo LIAM Groupe sérigraphié sur la poitrine. Plusieurs tailles disponibles.",
    price: "6 000 FCFA",
    image: "/images/Nos_produits/t_shirts/749354944_1658208942978091_7351098969532136844_n.jpg",
    category: "Vêtements",
    domain: "liam-groupe",
    order_index: 2,
  },
];

const teamData = [
  { name: "Marie-Claire Ngbokoli", role: "Fondatrice & Présidente", image: img("team-marie-claire", 600, 700), description: "Visionnaire et engagée, elle a fondé LIAM Groupe en 2015 pour offrir aux femmes et aux jeunes centrafricains les outils de leur propre développement.", social: { linkedin: "https://linkedin.com/in/marie-claire-ngbokoli", facebook: "https://facebook.com/marieclaire.ngbokoli", instagram: "https://instagram.com/marieclaire.ngbokoli", x: "https://x.com/marieclaire_ngb" }, order_index: 0 },
  { name: "Jean-Pierre Mbaïkoua", role: "Directeur Exécutif", image: img("team-jean-pierre", 600, 700), description: "Pilote la stratégie globale de l'organisation et la coordination des domaines d'intervention de LIAM Groupe.", social: { linkedin: "https://linkedin.com/in/jean-pierre-mbaikoua", facebook: "https://facebook.com/jeanpierre.mbaikoua", instagram: "https://instagram.com/jeanpierre.mbaikoua", x: "https://x.com/jp_mbaikoua" }, order_index: 1 },
  { name: "Aminata Koyambou", role: "Responsable G-Fitness", image: img("team-aminata", 600, 700), description: "Ancienne athlète, elle anime les programmes sportifs de LIAM Groupe destinés aux femmes et aux jeunes filles de Bangui.", social: { linkedin: "https://linkedin.com/in/aminata-koyambou", facebook: "https://facebook.com/aminata.koyambou", instagram: "https://instagram.com/aminata_koyambou", x: "https://x.com/aminata_koyambou" }, order_index: 2 },
  { name: "Florence Dacko-Posso", role: "Responsable O'GAB", image: img("team-florence", 600, 700), description: "Chef cuisinière et entrepreneure. Elle développe les programmes de gastronomie solidaire et valorise les produits locaux centrafricains à travers des ateliers et événements culinaires.", social: { linkedin: "https://linkedin.com/in/florence-dacko-posso", facebook: "https://facebook.com/florence.dackoposso", instagram: "https://instagram.com/florence_dacko", x: "https://x.com/florence_dacko" }, order_index: 3 },
  { name: "Romain Dologuélé", role: "Responsable Événementiel", image: img("team-romain", 600, 700), description: "Organisateur d'événements avec plus de 10 ans d'expérience. Il coordonne les galas, tournois sportifs et manifestations culturelles de LIAM Groupe à travers le pays.", social: { linkedin: "https://linkedin.com/in/romain-dologuele", facebook: "https://facebook.com/romain.dologuele", instagram: "https://instagram.com/romain_dologuele", x: "https://x.com/romain_dologuele" }, order_index: 4 },
  { name: "Esther Gbezera", role: "Responsable Communication", image: img("team-esther", 600, 700), description: "Journaliste et communicatrice. Elle assure la visibilité des actions de l'ONG et développe les partenariats médias pour amplifier l'impact de nos programmes.", social: { linkedin: "https://linkedin.com/in/esther-gbezera", facebook: "https://facebook.com/esther.gbezera", instagram: "https://instagram.com/esther_gbezera", x: "https://x.com/esther_gbezera" }, order_index: 5 },
];

const partnersData = [
  { name: "FAFECA", subtitle: "Fédération des Associations Féminines de Centrafrique", description: "FAFECA représente plus de 120 associations féminines à travers la République Centrafricaine. Partenaire historique de LIAM Groupe depuis 2018, elle nous accompagne dans le déploiement de nos programmes de leadership féminin et de formation des jeunes femmes.", logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/fafeca.png", initial: "F", color: "#8A0015", category: "PARTENAIRE INSTITUTIONNEL", collaboration: "Programmes conjoints de formation au leadership féminin, mentorat entrepreneurial.", website: null, order_index: 0 },
  { name: "ASK Gras Savoye", subtitle: "ASK Gras Savoye - Bangui", description: "Leader de l'assurance et de la protection sociale en République Centrafricaine. ASK Gras Savoye nous soutient financièrement et met à disposition ses salles de conférence pour nos événements.", logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/ask-gras-savoye.png", initial: "A", color: "#16335B", category: "PARTENAIRE CORPORATE", collaboration: "Soutien financier, mise à disposition d'espaces événementiels, mentorat entrepreneurial.", website: null, order_index: 1 },
  { name: "Salle King", subtitle: "Salle King - Complexe Événementiel", description: "Principal complexe événementiel de Bangui. Salle King accueille nos plus grands événements : galas de charité, concours de beauté, tournois sportifs et conférences internationales.", logo: null, initial: "S", color: "#C99A2E", category: "PARTENAIRE ÉVÉNEMENTIEL", collaboration: "Mise à disposition des salles, équipements audiovisuels, logistique événementielle.", website: null, order_index: 2 },
  { name: "Diaspora Multimedia", subtitle: "Diaspora Multimedia RCA", description: "Agence de communication et production audiovisuelle spécialisée dans la promotion de la culture centrafricaine. Diaspora Multimedia assure la couverture médiatique de tous nos événements et la production de nos contenus digitaux.", logo: null, initial: "D", color: "#1E5631", category: "PARTENAIRE MÉDIA", collaboration: "Couverture événementielle, production vidéo, community management, relations presse.", website: "#", order_index: 3 },
  { name: "MINUSCA", subtitle: "Mission Multidimensionnelle Intégrée des Nations Unies pour la Stabilisation en Centrafrique", description: "La MINUSCA soutient nos programmes de consolidation de la paix par le sport et la culture. Grâce à leur appui, nous avons pu organiser des événements inter-communautaires dans plusieurs préfectures de la RCA.", logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/minusca.png", initial: "M", color: "#2255A4", category: "PARTENAIRE INTERNATIONAL", collaboration: "Financement de projets, sécurité événementielle, appui logistique sur le terrain.", website: "#", order_index: 4 },
  { name: "ONG Espoir", subtitle: "ONG Espoir pour la Jeunesse", description: "Organisation non gouvernementale centrafricaine dédiée à l'éducation et à l'insertion professionnelle des jeunes. Ensemble, nous avons formé plus de 500 jeunes aux métiers de la cuisine, de la communication et du sport.", logo: null, initial: "E", color: "#C9531E", category: "PARTENAIRE ASSOCIATIF", collaboration: "Programmes de formation conjoints, bourses d'études, stages professionnels.", website: "#", order_index: 5 },
  { name: "Orange Centrafrique", subtitle: "Orange Centrafrique — Bangui", description: "Premier opérateur de télécommunications en République Centrafricaine. Orange Centrafrique soutient nos événements sportifs et culturels en fournissant connectivité, équipements et visibilité sur ses canaux digitaux auprès de millions d'abonnés.", logo: null, initial: "O", color: "#FF7900", category: "PARTENAIRE CORPORATE", collaboration: "Connectivité événementielle, soutien logistique, relais médias digitaux.", website: "#", order_index: 6 },
  { name: "UNICEF RCA", subtitle: "Fonds des Nations Unies pour l'Enfance — RCA", description: "L'UNICEF République Centrafricaine appuie nos programmes de formation des jeunes et de sport au féminin. Grâce à ce partenariat, plus de 200 jeunes filles ont bénéficié d'ateliers de leadership et de sensibilisation aux droits de l'enfant.", logo: null, initial: "U", color: "#1CABE2", category: "PARTENAIRE INTERNATIONAL", collaboration: "Co-financement de programmes jeunesse, formation aux droits de l'enfant, plaidoyer.", website: "#", order_index: 7 },
  { name: "Radio Centrafrique", subtitle: "Radio Centrafrique — La voix de la Nation", description: "Première radio nationale de la RCA, Radio Centrafrique est notre partenaire média historique. Elle couvre l'ensemble de nos événements et diffuse nos messages d'intérêt général auprès de millions d'auditeurs à travers le pays.", logo: null, initial: "R", color: "#2E7D32", category: "PARTENAIRE MÉDIA", collaboration: "Couverture médiatique, spots radio, interviews, diffusion de nos communiqués.", website: "#", order_index: 8 },
  { name: "Hôtel Ledger Plaza", subtitle: "Ledger Plaza Bangui — Hôtel 5 étoiles", description: "Principal hôtel de standing de Bangui, le Ledger Plaza accueille nos galas de charité, conférences de presse et réceptions officielles. Leur équipe événementielle nous accompagne dans l'organisation de nos plus grands rendez-vous.", logo: null, initial: "H", color: "#8B4513", category: "PARTENAIRE ÉVÉNEMENTIEL", collaboration: "Mise à disposition de salles, hébergement de nos invités, offre préférentielle pour nos événements.", website: "#", order_index: 9 },
];

const testimonialsData = [
  { name: "Christelle Ngoumbango", role: "Bénéficiaire, programme Formation des Jeunes", quote: "La formation en bureautique et communication digitale m'a permis de décrocher un stage dans une entreprise de la place. Aujourd'hui je suis autonome et je peux aider ma famille. Merci LIAM Groupe !", image: img("testimonial-christelle", 100, 100), order_index: 0 },
  { name: "Michel Béranger", role: "Chef cuisinier, partenaire O'GAB", quote: "O'GAB met en valeur le patrimoine culinaire centrafricain comme personne d'autre. Les ateliers gastronomiques créent des emplois pour les femmes tout en préservant nos traditions — une initiative remarquable.", image: img("testimonial-michel", 100, 100), order_index: 1 },
  { name: "Fatimé Hassan", role: "Représentante, MINUSCA", quote: "Notre partenariat avec LIAM Groupe démontre comment la société civile peut être un relais efficace pour les initiatives de paix et de développement. Leur connaissance du terrain est exceptionnelle.", image: img("testimonial-fatime", 100, 100), order_index: 2 },
];

// =====================================================
// Seed Functions
// =====================================================

async function seed(table, rows, conflictColumn) {
  const label = table.padEnd(14);
  console.log(`\n📦 ${label}… (${rows.length} lignes)`);

  if (conflictColumn) {
    const { error } = await supabase.from(table).upsert(rows, {
      onConflict: conflictColumn,
      ignoreDuplicates: false,
    });
    logResult(table, !error, rows.length);
    if (error) console.error('   →', error.message);
  } else {
    const { error } = await supabase.from(table).insert(rows);
    if (error && error.message?.includes('duplicate')) {
      console.log(`  ⚠️  Certaines lignes existent déjà — ignoré`);
    } else {
      logResult(table, !error, rows.length);
      if (error) console.error('   →', error.message);
    }
  }
}

// =====================================================
// Main
// =====================================================

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   🌱 LIAM Groupe — Seed Automatique  ║');
  console.log('╚══════════════════════════════════════╝');

  const start = Date.now();

  await seed('events', eventsData, 'slug');
  await seed('news', newsData, 'slug');
  await seed('domains', domainsData, 'slug');
  await seed('products', productsData, 'slug');
  await seed('team', teamData);
  await seed('partners', partnersData);
  await seed('testimonials', testimonialsData);
  await seed('menu_items', menuItemsData);
  await seed('site_settings', settingsData, 'key');

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log('\n' + '─'.repeat(40));
  if (totalErrors === 0) {
    console.log(`\n🎉 Succès ! ${totalInserted} lignes insérées en ${elapsed}s`);
  } else {
    console.log(`\n⚠️  Terminé avec ${totalErrors} erreur(s) — ${totalInserted} lignes insérées en ${elapsed}s`);
  }
}

main().catch((err) => {
  console.error('\n💥 Erreur fatale :', err);
  process.exit(1);
});
