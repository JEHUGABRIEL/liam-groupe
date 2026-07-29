-- =====================================================
-- SEED : Événements mock → Base de données Supabase
-- Insère les 7 événements définis dans src/data/siteData.js
-- =====================================================
-- Exécute ce fichier dans Supabase Dashboard > SQL Editor
-- Il peut être exécuté plusieurs fois sans risque (INSERT OR CONFLICT)
-- =====================================================

INSERT INTO events (slug, title, description, date, end_date, location, image, status, category, order_index)
VALUES
  (
    'tournoi-feminin-basketball-2026',
    'Tournoi Féminin de Basketball — Édition 2026',
    'La 3ème édition du tournoi inter-quartiers de basketball féminin rassemble 16 équipes pour une compétition de haut niveau…',
    '15 Août 2026',
    NULL,
    'Gymnase Omnisports de Bangui',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/event-basketball',
    'a_venir',
    'G-Fitness',
    0
  ),
  (
    'conference-leadership-feminin',
    'Conférence Leadership Féminin — « Oser Entreprendre »',
    'Une journée de partage et d''inspiration avec des femmes leaders du secteur privé et public centrafricain. Ateliers pratiques,…',
    '28 Juin 2026',
    NULL,
    'Salle de Conférence ASK Gras Savoye, Bangui',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/event-conference',
    'a_venir',
    'Entrepreneuriat',
    1
  ),
  (
    'atelier-formation-creation-entreprise',
    'Atelier Formation — Création d''Entreprise',
    'Formation intensive de 3 jours pour les jeunes entrepreneurs. Business model, financement, marketing digital et gestion…',
    '10 Juillet 2026',
    NULL,
    'Siège LIAM Groupe, Bangui',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/event-formation',
    'a_venir',
    'Formation',
    2
  ),
  (
    'soiree-gala-liam-2025',
    'Soirée de Gala — LIAM Groupe 2025',
    'Une soirée prestigieuse réunissant partenaires, sponsors et personnalités pour célébrer les réalisations de l''année…',
    '20 Décembre 2025',
    NULL,
    'Hôtel Ledger Plaza, Bangui',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/event-gala',
    'passe',
    'Événementiel',
    3
  ),
  (
    'atelier-gastronomie-saveurs-centrafrique',
    'Atelier Gastronomie — Saveurs de Centrafrique',
    'Atelier culinaire mettant à l''honneur les produits locaux et le savoir-faire des femmes centrafricaines. Dégustation et…',
    '10 Novembre 2025',
    NULL,
    'Espace O''GAB, Bangui',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto,w_800,h_600,c_fill,dpr_auto/v1/liam-groupe/event-gastronomie',
    'passe',
    'O''GAB',
    4
  ),
  (
    'miss-centrafrique-2025',
    'Miss Centrafrique 2025',
    'Concours de beauté et de culture célébrant la diversité et la richesse culturelle de la République Centrafricaine. Plus de 5000…',
    '15 Octobre 2025',
    NULL,
    'Salle King, Bangui',
    '/images/miss_centrafrique/652260934_122213049812493986_1741650240073091187_n.jpg',
    'passe',
    'Miss Centrafrique',
    5
  ),
  (
    'casting-regional-miss-centrafrique-2026',
    'Casting Régional — Miss Centrafrique 2026',
    'Tournée de sélection dans les principales villes du pays pour repérer les candidates de l''édition 2026. Inscriptions ouvertes aux femmes de 18 à 26 ans…',
    '5 Septembre 2026',
    NULL,
    'Bouar, Berbérati, Bangassou (tournée régionale)',
    '/images/miss_centrafrique/657846609_122214853046493986_902888607739175824_n.jpg',
    'a_venir',
    'Miss Centrafrique',
    6
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Vérification du résultat
-- =====================================================
SELECT id, slug, title, date, status, category FROM events ORDER BY order_index;
